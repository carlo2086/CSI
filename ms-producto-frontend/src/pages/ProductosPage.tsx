import { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import type { Producto } from "../models/Producto";
import { SearchBar } from "../components/SearchBar";
import { Message } from "../components/Message";
import { Button, ButtonLink } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Icon } from "../components/Icon";
import { StockBadge } from "../components/StockBadge";
import { formatearMoneda } from "../utils/formatters";

export function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [soloReposicion, setSoloReposicion] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [porDesactivar, setPorDesactivar] = useState<Producto | null>(null);

    async function cargar() {
        try {
            setCargando(true);
            setProductos(await productoService.listar());
            setError(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargar();
    }, []);

    async function desactivar() {
        if (!porDesactivar) return;
        const id = porDesactivar.id;
        setPorDesactivar(null);
        try {
            await productoService.eliminar(id);
            await cargar();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    const q = busqueda.trim().toLowerCase();
    const filtrados = productos.filter(
        (p) =>
            (p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)) &&
            (!soloReposicion || p.stockBajo || p.stockActual <= 0)
    );

    const activos = productos.filter((p) => p.activo);
    const bajos = activos.filter((p) => p.stockBajo && p.stockActual > 0).length;
    const agotados = activos.filter((p) => p.stockActual <= 0).length;
    const valorizado = activos.reduce((s, p) => s + p.precio * p.stockActual, 0);
    const porReponer = bajos + agotados;

    return (
        <section className="stack">
            <div className="card page-head">
                <div className="page-head-left">
                    <div className="page-head-icon"><Icon name="inventory_2" size="lg" /></div>
                    <div>
                        <div className="page-head-title">
                            <h1>Catálogo de Productos</h1>
                            <span className="badge badge-count">{activos.length} productos activos</span>
                        </div>
                        <p className="muted small">Gestión de existencias, precios de venta (PEN) y umbrales de reposición.</p>
                    </div>
                </div>
                <ButtonLink to="/productos/nuevo"><Icon name="add" size="sm" />Nuevo producto</ButtonLink>
            </div>

            {error && <Message tipo="error" texto={error} onCerrar={() => setError(null)} />}

            <div className="metrics">
                <div className="card metric">
                    <div>
                        <div className="metric-label">Activos</div>
                        <div className="metric-value">{activos.length}</div>
                    </div>
                    <span className="t-success"><Icon name="check_circle" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label t-danger">Stock bajo</div>
                        <div className="metric-value t-danger">{bajos}</div>
                    </div>
                    <span className="t-danger"><Icon name="crisis_alert" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label">Agotados</div>
                        <div className="metric-value">{agotados}</div>
                    </div>
                    <span className="muted"><Icon name="production_quantity_limits" size="lg" /></span>
                </div>
                <div className="card metric">
                    <div>
                        <div className="metric-label">Valorizado (precio venta)</div>
                        <div className="metric-value mono">{formatearMoneda(valorizado)}</div>
                    </div>
                    <span className="t-primary"><Icon name="payments" size="lg" /></span>
                </div>
            </div>

            <div className="card toolbar">
                <div className="grow">
                    <SearchBar valor={busqueda} onChange={setBusqueda} placeholder="Buscar por código o nombre de producto..." />
                </div>
                <button type="button" className="chip" aria-pressed={soloReposicion} onClick={() => setSoloReposicion((v) => !v)}>
                    <Icon name="warning" size="sm" />
                    Solo reposición
                    <span className="count">{porReponer}</span>
                </button>
                <span className="muted">
                    <strong className="mono" style={{ color: "var(--on-surface)" }}>{filtrados.length}</strong> productos
                </span>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
                {cargando ? (
                    <p className="empty muted" role="status">Cargando productos...</p>
                ) : filtrados.length === 0 ? (
                    <div className="empty">
                        <div className="empty-icon"><Icon name="manage_search" size="lg" /></div>
                        <h3>{productos.length === 0 ? "Aún no hay productos registrados" : "No se encontraron productos"}</h3>
                        <p className="muted">
                            {productos.length === 0
                                ? "Registre el primer producto para empezar a controlar su stock."
                                : "No hay coincidencias para la búsqueda o filtro seleccionado."}
                        </p>
                        {productos.length > 0 && (
                            <Button variante="secundario" onClick={() => { setBusqueda(""); setSoloReposicion(false); }}>
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Código</th>
                                        <th scope="col">Producto</th>
                                        <th scope="col" className="right">Precio venta (PEN)</th>
                                        <th scope="col" className="right">Existencias / Mínimo</th>
                                        <th scope="col" className="center">Estado de stock</th>
                                        <th scope="col" className="right"><span className="sr-only">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtrados.map((p) => (
                                        <tr key={p.id}>
                                            <td className="sku">{p.codigo}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                                                {p.descripcion && <div className="muted small">{p.descripcion}</div>}
                                            </td>
                                            <td className="right mono" style={{ fontWeight: 600 }}>{formatearMoneda(p.precio)}</td>
                                            <td className="right mono">
                                                <span className={p.stockBajo ? "t-danger" : "t-success"} style={{ fontWeight: 600 }}>{p.stockActual}</span>
                                                <span className="muted"> / mín. {p.stockMinimo}</span>
                                            </td>
                                            <td className="center"><StockBadge stockActual={p.stockActual} stockBajo={p.stockBajo} /></td>
                                            <td>
                                                <div className="cell-actions">
                                                    <ButtonLink to={`/productos/${p.id}/editar`} variante="secundario" tamano="sm">
                                                        <Icon name="edit" size="sm" />Editar
                                                    </ButtonLink>
                                                    <Button variante="ghost-danger" tamano="sm" onClick={() => setPorDesactivar(p)}>
                                                        <Icon name="block" size="sm" />Desactivar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-foot">
                            <span>Mostrando <strong>{filtrados.length}</strong> de <strong>{productos.length}</strong> productos registrados</span>
                        </div>
                    </>
                )}
            </div>

            <ConfirmDialog
                abierto={porDesactivar !== null}
                titulo="Desactivar producto"
                nota="El historial de entradas y salidas previas se conserva."
                textoConfirmar="Desactivar producto"
                onConfirmar={desactivar}
                onCancelar={() => setPorDesactivar(null)}
            >
                ¿Está seguro que desea desactivar <strong style={{ color: "var(--on-surface)" }}>«{porDesactivar?.nombre}»</strong>{" "}
                (<span className="mono">{porDesactivar?.codigo}</span>)? Dejará de estar disponible para nuevos movimientos de inventario.
            </ConfirmDialog>
        </section>
    );
}
