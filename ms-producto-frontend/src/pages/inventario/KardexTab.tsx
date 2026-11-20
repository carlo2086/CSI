import { useEffect, useMemo, useRef, useState } from "react";
import { inventarioService } from "../../services/inventarioService";
import type { Movimiento } from "../../models/Inventario";
import type { Producto } from "../../models/Producto";
import { Message } from "../../components/Message";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { SearchBar } from "../../components/SearchBar";
import { aFechaLocal, formatearFecha, formatearFechaHora } from "../../utils/formatters";
import { exportarExcel, exportarPdf, type FilaKardex } from "../../utils/exportKardex";

interface Props {
    productos: Producto[];
}

type FiltroTipo = "TODOS" | "ENTRADA" | "SALIDA";
type Formato = "xlsx" | "pdf";

export function KardexTab({ productos }: Props) {
    const [productoId, setProductoId] = useState<number | "">("");
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tipo, setTipo] = useState<FiltroTipo>("TODOS");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [modal, setModal] = useState(false);
    const [formato, setFormato] = useState<Formato>("xlsx");
    const [expDesde, setExpDesde] = useState("");
    const [expHasta, setExpHasta] = useState("");

    const nombres = useMemo(() => new Map(productos.map((p) => [p.id, p.nombre])), [productos]);

    useEffect(() => {
        let vigente = true;
        const ids = productoId === "" ? productos.map((p) => p.id) : [productoId];
        Promise.all(ids.map((id) => inventarioService.listarMovimientos(id)))
            .then((listas) => {
                if (!vigente) return;
                setMovimientos(listas.flat().sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)));
                setError(null);
            })
            .catch((e) => vigente && setError((e as Error).message))
            .finally(() => vigente && setCargando(false));
        return () => { vigente = false; };
    }, [productoId, productos]);

    function enRango(m: Movimiento, d: string, h: string) {
        const f = aFechaLocal(m.fechaRegistro);
        return (!d || f >= d) && (!h || f <= h);
    }

    const q = busqueda.trim().toLowerCase();
    const filtrados = movimientos.filter(
        (m) =>
            (tipo === "TODOS" || m.tipo === tipo) &&
            enRango(m, desde, hasta) &&
            (!q || m.codigoProducto.toLowerCase().includes(q) || (nombres.get(m.productoId) ?? "").toLowerCase().includes(q))
    );

    const entradas = filtrados.filter((m) => m.tipo === "ENTRADA").reduce((s, m) => s + m.cantidad, 0);
    const salidas = filtrados.filter((m) => m.tipo === "SALIDA").reduce((s, m) => s + m.cantidad, 0);
    const neto = entradas - salidas;

    function abrirModal() {
        setExpDesde(desde);
        setExpHasta(hasta);
        setModal(true);
    }

    const aExportar: FilaKardex[] = movimientos
        .filter((m) => (tipo === "TODOS" || m.tipo === tipo) && enRango(m, expDesde, expHasta))
        .map((m) => ({
            fecha: m.fechaRegistro,
            codigo: m.codigoProducto,
            producto: nombres.get(m.productoId) ?? "",
            tipo: m.tipo,
            cantidad: m.cantidad,
            stockResultante: m.stockResultante,
            motivo: m.motivo ?? "",
        }));

    function periodoTexto() {
        if (!expDesde && !expHasta) return "Todo el historial";
        return `${expDesde ? formatearFecha(`${expDesde}T00:00:00`) : "inicio"} – ${expHasta ? formatearFecha(`${expHasta}T00:00:00`) : "hoy"}`;
    }

    function descargar() {
        try {
            if (formato === "xlsx") exportarExcel(aExportar, periodoTexto());
            else exportarPdf(aExportar, periodoTexto());
            setModal(false);
        } catch (e) {
            setError((e as Error).message);
            setModal(false);
        }
    }

    return (
        <div className="stack">
            {error && <Message tipo="error" texto={error} onCerrar={() => setError(null)} />}

            <div className="metrics">
                <div className="card metric">
                    <div>
                        <div className="metric-label">Total entradas</div>
                        <div className="metric-value t-success mono">+{entradas} <span className="small">und</span></div>
                    </div>
                    <span className="t-success"><Icon name="call_received" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label">Total salidas</div>
                        <div className="metric-value t-danger mono">-{salidas} <span className="small">und</span></div>
                    </div>
                    <span className="t-danger"><Icon name="call_made" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label">Balance neto</div>
                        <div className={`metric-value mono ${neto >= 0 ? "t-primary" : "t-danger"}`}>{neto >= 0 ? "+" : ""}{neto} <span className="small">und</span></div>
                    </div>
                    <span className="t-primary"><Icon name="balance" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label">Movimientos</div>
                        <div className="metric-value mono">{filtrados.length}</div>
                        <div className="metric-hint">registros en el filtro</div>
                    </div>
                    <span className="muted"><Icon name="receipt_long" size="lg" /></span>
                </div>
            </div>

            <div className="card toolbar">
                <div className="seg" role="group" aria-label="Tipo de movimiento">
                    {(["TODOS", "ENTRADA", "SALIDA"] as const).map((t) => (
                        <button key={t} type="button" aria-pressed={tipo === t} onClick={() => setTipo(t)}>
                            {t === "TODOS" ? "Todos" : t === "ENTRADA" ? "Solo entradas" : "Solo salidas"}
                        </button>
                    ))}
                </div>
                <select className="input select-toolbar" aria-label="Producto" value={productoId}
                    onChange={(e) => { setCargando(true); setProductoId(e.target.value === "" ? "" : Number(e.target.value)); }}>
                    <option value="">Todos los productos</option>
                    {productos.map((p) => <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>)}
                </select>
                <label className="fila" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="small muted">Desde</span>
                    <input type="date" className="input date-in" value={desde} max={hasta || undefined} onChange={(e) => setDesde(e.target.value)} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="small muted">Hasta</span>
                    <input type="date" className="input date-in" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} />
                </label>
                <div className="grow"><SearchBar valor={busqueda} onChange={setBusqueda} placeholder="Buscar SKU o nombre..." /></div>
                <Button variante="exito" onClick={abrirModal} disabled={movimientos.length === 0}>
                    <Icon name="download" size="sm" />Exportar Kardex
                </Button>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
                {cargando ? (
                    <p className="empty muted" role="status">Cargando movimientos...</p>
                ) : filtrados.length === 0 ? (
                    <div className="empty">
                        <div className="empty-icon"><Icon name="manage_search" size="lg" /></div>
                        <h3>Sin movimientos</h3>
                        <p className="muted">No hay movimientos que coincidan con los filtros seleccionados.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Fecha y hora</th>
                                        <th scope="col">Producto y SKU</th>
                                        <th scope="col" className="center">Operación</th>
                                        <th scope="col" className="right">Cantidad</th>
                                        <th scope="col" className="right">Stock resultante</th>
                                        <th scope="col">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrados.map((m) => (
                                        <tr key={m.id}>
                                            <td className="mono muted" style={{ whiteSpace: "nowrap" }}>{formatearFechaHora(m.fechaRegistro)}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{nombres.get(m.productoId) ?? "—"}</div>
                                                <div className="mono muted small">SKU: {m.codigoProducto}</div>
                                            </td>
                                            <td className="center">
                                                <span className={`badge ${m.tipo === "ENTRADA" ? "badge-entrada" : "badge-salida"}`}>
                                                    <Icon name={m.tipo === "ENTRADA" ? "arrow_downward" : "arrow_upward"} size="sm" />
                                                    {m.tipo === "ENTRADA" ? "Entrada" : "Salida"}
                                                </span>
                                            </td>
                                            <td className={`right ${m.tipo === "ENTRADA" ? "qty-pos" : "qty-neg"}`}>
                                                {m.tipo === "ENTRADA" ? "+" : "-"}{m.cantidad} und
                                            </td>
                                            <td className="right mono">{m.stockResultante}</td>
                                            <td className="muted">{m.motivo ?? ""}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-foot">
                            <span>Mostrando <strong>{filtrados.length}</strong> de <strong>{movimientos.length}</strong> movimientos</span>
                            <span className="mono">
                                Entradas: <strong className="t-success">+{entradas}</strong> · Salidas: <strong className="t-danger">-{salidas}</strong>
                            </span>
                        </div>
                    </>
                )}
            </div>

            <ExportDialog
                abierto={modal}
                desde={expDesde} hasta={expHasta} formato={formato} total={aExportar.length}
                onDesde={setExpDesde} onHasta={setExpHasta} onFormato={setFormato}
                onCancelar={() => setModal(false)} onDescargar={descargar}
            />
        </div>
    );
}

interface ExportProps {
    abierto: boolean;
    desde: string;
    hasta: string;
    formato: Formato;
    total: number;
    onDesde: (v: string) => void;
    onHasta: (v: string) => void;
    onFormato: (f: Formato) => void;
    onCancelar: () => void;
    onDescargar: () => void;
}

function ExportDialog({ abierto, desde, hasta, formato, total, onDesde, onHasta, onFormato, onCancelar, onDescargar }: ExportProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (abierto && !d.open) d.showModal();
        if (!abierto && d.open) d.close();
    }, [abierto]);

    return (
        <dialog ref={ref} aria-labelledby="export-titulo" onCancel={(e) => { e.preventDefault(); onCancelar(); }}>
            <div className="modal-head">
                <div className="modal-icon primary"><Icon name="sim_card_download" /></div>
                <div style={{ flex: 1 }}>
                    <h3 id="export-titulo">Exportar Kardex de movimientos</h3>
                    <p className="muted small">Seleccione el período y el formato del reporte.</p>
                </div>
                <button type="button" className="icon-btn" aria-label="Cerrar" onClick={onCancelar}><Icon name="close" size="sm" /></button>
            </div>
            <div className="modal-body">
                <div className="form-grid" style={{ gap: "1rem" }}>
                    <div className="field">
                        <label className="field-label" htmlFor="exp-desde">Fecha desde</label>
                        <input id="exp-desde" type="date" className="input" value={desde} max={hasta || undefined} onChange={(e) => onDesde(e.target.value)} />
                    </div>
                    <div className="field">
                        <label className="field-label" htmlFor="exp-hasta">Fecha hasta</label>
                        <input id="exp-hasta" type="date" className="input" value={hasta} min={desde || undefined} onChange={(e) => onHasta(e.target.value)} />
                    </div>
                </div>
                <p className="field-help">Déjelas vacías para exportar todo el historial.</p>
                <div className="format-grid" role="radiogroup" aria-label="Formato de exportación">
                    <label className="format-opt">
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className="t-success"><Icon name="table_view" /></span>
                            <span><strong>Excel</strong><br /><span className="small muted">Planilla con detalle y saldos</span></span>
                        </span>
                        <input type="radio" name="formato" checked={formato === "xlsx"} onChange={() => onFormato("xlsx")} />
                    </label>
                    <label className="format-opt">
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className="t-danger"><Icon name="picture_as_pdf" /></span>
                            <span><strong>PDF</strong><br /><span className="small muted">Imprimir o guardar como PDF</span></span>
                        </span>
                        <input type="radio" name="formato" checked={formato === "pdf"} onChange={() => onFormato("pdf")} />
                    </label>
                </div>
                <div className="modal-note">
                    <Icon name="info" size="sm" />
                    Registros incluidos en el reporte: <strong className="mono">{total}</strong>
                </div>
            </div>
            <div className="modal-foot">
                <Button variante="secundario" onClick={onCancelar}>Cancelar</Button>
                <Button onClick={onDescargar} disabled={total === 0}><Icon name="download" size="sm" />Descargar reporte</Button>
            </div>
        </dialog>
    );
}
