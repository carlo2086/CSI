import { useEffect, useState, type FormEvent } from "react";
import { inventarioService } from "../../services/inventarioService";
import type { Movimiento, Stock, TipoMovimiento } from "../../models/Inventario";
import type { Producto } from "../../models/Producto";
import { Message } from "../../components/Message";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { formatearFechaHora } from "../../utils/formatters";

export interface Preset {
    productoId: number;
    cantidad: number;
}

interface Props {
    productos: Producto[];
    preset?: Preset;
    onRegistrado: () => Promise<void>;
}

const MOTIVOS = [
    "Recepción de pedido de proveedor",
    "Reposición regular",
    "Venta por mayor",
    "Merma por vencimiento próximo",
    "Rotura / daño en exhibición",
    "Ajuste de inventario físico",
];

export function MovimientoTab({ productos, preset, onRegistrado }: Props) {
    const [productoId, setProductoId] = useState<number | "">(preset?.productoId ?? "");
    const [stock, setStock] = useState<Stock | null>(null);
    const [recientes, setRecientes] = useState<Movimiento[]>([]);
    const [tipo, setTipo] = useState<TipoMovimiento>("ENTRADA");
    const [cantidad, setCantidad] = useState(preset?.cantidad ?? 1);
    const [motivo, setMotivo] = useState(preset ? "Reabastecimiento de stock" : "");
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    useEffect(() => {
        if (productoId === "") return;
        let vigente = true;
        Promise.all([
            inventarioService.consultarStock(productoId),
            inventarioService.listarMovimientos(productoId),
        ])
            .then(([s, m]) => {
                if (!vigente) return;
                setStock(s);
                setRecientes([...m].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)).slice(0, 5));
            })
            .catch((e) => vigente && setError((e as Error).message));
        return () => { vigente = false; };
    }, [productoId]);

    function seleccionar(valor: string) {
        setError(null);
        setExito(null);
        if (valor === "") {
            setProductoId("");
            setStock(null);
            setRecientes([]);
        } else {
            setProductoId(Number(valor));
        }
    }

    const actual = productoId === "" ? null : stock;
    const delta = tipo === "ENTRADA" ? cantidad : -cantidad;
    const proyectado = actual ? actual.stockActual + delta : null;
    const excede = tipo === "SALIDA" && actual !== null && cantidad > actual.stockActual;
    const bajoMinimo = actual !== null && proyectado !== null && proyectado >= 0 && proyectado < actual.stockMinimo;

    async function registrar(e: FormEvent) {
        e.preventDefault();
        if (productoId === "" || excede) return;
        setEnviando(true);
        setError(null);
        setExito(null);
        const data = { productoId, cantidad, motivo: motivo.trim() || undefined };
        try {
            if (tipo === "ENTRADA") await inventarioService.registrarEntrada(data);
            else await inventarioService.registrarSalida(data);
            const [s, m] = await Promise.all([
                inventarioService.consultarStock(productoId),
                inventarioService.listarMovimientos(productoId),
                onRegistrado(),
            ]);
            setStock(s);
            setRecientes([...m].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)).slice(0, 5));
            setExito(`Movimiento registrado. Nuevo stock de ${s.nombre}: ${s.stockActual} und.`);
            setCantidad(1);
            setMotivo("");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="stack">
            {error && <Message tipo="error" texto={error} onCerrar={() => setError(null)} />}
            {exito && <Message tipo="exito" texto={exito} onCerrar={() => setExito(null)} />}

            <form onSubmit={registrar} className="card card-pad stack" style={{ gap: "1rem" }}>
                <div className="page-head-left">
                    <div className="page-head-icon" style={{ background: "var(--primary-container)", color: "#fff" }}>
                        <Icon name="swap_horiz" />
                    </div>
                    <div>
                        <h2>Registrar movimiento operativo</h2>
                        <p className="muted small">Ajuste instantáneo en kardex y existencias físicas.</p>
                    </div>
                </div>

                <div className="mov-grid">
                    <div className="field c-5">
                        <label className="field-label" htmlFor="producto">Producto de bodega</label>
                        <div className="input-wrap">
                            <Icon name="barcode_scanner" />
                            <select id="producto" className="input input-lg" required value={productoId}
                                onChange={(e) => seleccionar(e.target.value)}>
                                <option value="">Seleccione un producto...</option>
                                {productos.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>
                                ))}
                            </select>
                        </div>
                        {actual && (
                            <div className={`callout${actual.stockBajo ? " bajo" : ""}`}>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Icon name={actual.stockBajo ? "warning" : "inventory_2"} size="sm" />
                                    Stock disponible:
                                </span>
                                <span className="mono" style={{ fontWeight: 700, fontSize: "1.125rem" }}>{actual.stockActual} und</span>
                            </div>
                        )}
                    </div>

                    <div className="field c-3">
                        <span className="field-label" id="lbl-tipo">Tipo de movimiento</span>
                        <div className="pills" role="radiogroup" aria-labelledby="lbl-tipo">
                            <label className="pill-radio entrada">
                                <input type="radio" name="tipo" className="sr-only" checked={tipo === "ENTRADA"} onChange={() => setTipo("ENTRADA")} />
                                <Icon name="south_east" size="sm" />Entrada
                            </label>
                            <label className="pill-radio salida">
                                <input type="radio" name="tipo" className="sr-only" checked={tipo === "SALIDA"} onChange={() => setTipo("SALIDA")} />
                                <Icon name="north_west" size="sm" />Salida
                            </label>
                        </div>
                        <span className={`small ${tipo === "ENTRADA" ? "t-success" : "t-danger"}`} style={{ fontWeight: 500 }}>
                            {tipo === "ENTRADA" ? "Recepción de proveedor o compra mayorista" : "Venta, merma o consumo interno"}
                        </span>
                    </div>

                    <div className="field c-4">
                        <label className="field-label" htmlFor="cantidad">
                            Cantidad a mover <span className="field-help">Valor entero</span>
                        </label>
                        <div className="qty-row">
                            <input id="cantidad" type="number" className="input input-lg input-num" min={1} step={1} required
                                value={cantidad} onChange={(e) => setCantidad(Math.max(0, Math.trunc(Number(e.target.value))))} />
                            {[6, 12, 24].map((n) => (
                                <Button key={n} type="button" variante="secundario" tamano="lg" className="quick"
                                    onClick={() => setCantidad((c) => c + n)}>+{n}</Button>
                            ))}
                        </div>
                        <span className="field-help">Use los accesos rápidos para bultos estándar.</span>
                    </div>
                </div>

                <div className="mov-grid" style={{ alignItems: "end" }}>
                    <div className="field c-8">
                        <label className="field-label" htmlFor="motivo">Motivo / Glosa del comprobante</label>
                        <input id="motivo" className="input input-lg" list="motivos" maxLength={255} value={motivo}
                            placeholder="Ej. Guía de remisión N° 004-9821 / Reposición regular"
                            onChange={(e) => setMotivo(e.target.value)} />
                        <datalist id="motivos">{MOTIVOS.map((m) => <option key={m} value={m} />)}</datalist>
                    </div>
                    <div className="c-4">
                        <Button type="submit" tamano="lg" bloque disabled={productoId === "" || enviando || excede || cantidad < 1}>
                            {enviando ? <span className="spinner" role="status" aria-label="Guardando" /> : <Icon name="save" size="sm" />}
                            {enviando ? "Guardando en Kardex..." : "Registrar movimiento"}
                        </Button>
                    </div>
                </div>

                {actual && proyectado !== null && (
                    <div>
                        <div className="projection" aria-live="polite">
                            <div className="projection-col">
                                <div className="metric-label">Actual</div>
                                <div className="num">{actual.stockActual}</div>
                            </div>
                            <div className={`mono ${delta >= 0 ? "t-success" : "t-danger"}`} style={{ fontWeight: 700 }}>
                                <Icon name={delta >= 0 ? "add_circle" : "remove_circle"} /> {delta >= 0 ? "+" : ""}{delta}
                            </div>
                            <div className="projection-col">
                                <div className="metric-label">Proyectado</div>
                                <div className={`num ${proyectado < 0 || bajoMinimo ? "t-danger" : "t-success"}`}>{proyectado}</div>
                            </div>
                        </div>
                        {excede && (
                            <p className="field-error" style={{ marginTop: "0.5rem" }}>
                                <Icon name="error" size="sm" />La salida supera el stock disponible ({actual.stockActual} und).
                            </p>
                        )}
                        {!excede && bajoMinimo && (
                            <p className="field-error" style={{ marginTop: "0.5rem" }}>
                                <Icon name="warning" size="sm" />El stock quedaría por debajo del mínimo ({actual.stockMinimo} und).
                            </p>
                        )}
                    </div>
                )}
            </form>

            {actual && (
                <div className="card" style={{ overflow: "hidden" }}>
                    <div className="card-pad-sm" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Icon name="receipt_long" />
                        <h3>Últimos movimientos de {actual.nombre}</h3>
                    </div>
                    {recientes.length === 0 ? (
                        <p className="empty muted">Este producto aún no tiene movimientos.</p>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Fecha y hora</th>
                                        <th scope="col" className="center">Tipo</th>
                                        <th scope="col" className="right">Cantidad</th>
                                        <th scope="col" className="right">Stock resultante</th>
                                        <th scope="col">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recientes.map((m) => (
                                        <tr key={m.id}>
                                            <td className="mono muted">{formatearFechaHora(m.fechaRegistro)}</td>
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
                    )}
                </div>
            )}
        </div>
    );
}
