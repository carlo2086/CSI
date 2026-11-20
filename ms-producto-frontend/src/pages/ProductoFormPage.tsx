import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productoService } from "../services/productoService";
import type { Producto, ProductoInput } from "../models/Producto";
import { Message } from "../components/Message";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { StockBadge } from "../components/StockBadge";

const VACIO: ProductoInput = { codigo: "", nombre: "", descripcion: "", precio: 0, stockMinimo: 0 };

export function ProductoFormPage() {
    const { id } = useParams();
    const editando = id !== undefined;
    const navigate = useNavigate();
    const [form, setForm] = useState<ProductoInput>(VACIO);
    const [actual, setActual] = useState<Producto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!editando) return;
        productoService
            .obtener(Number(id))
            .then((p) => {
                setActual(p);
                setForm({
                    codigo: p.codigo,
                    nombre: p.nombre,
                    descripcion: p.descripcion ?? "",
                    precio: p.precio,
                    stockMinimo: p.stockMinimo,
                });
            })
            .catch((e) => setError((e as Error).message));
    }, [id, editando]);

    function cambiar<K extends keyof ProductoInput>(campo: K, valor: ProductoInput[K]) {
        setForm((f) => ({ ...f, [campo]: valor }));
    }

    async function enviar(e: FormEvent) {
        e.preventDefault();
        setGuardando(true);
        setError(null);
        try {
            if (editando) await productoService.actualizar(Number(id), form);
            else await productoService.crear(form);
            navigate("/productos");
        } catch (err) {
            setError((err as Error).message);
            setGuardando(false);
        }
    }

    const descripcion = form.descripcion ?? "";

    return (
        <section className="stack">
            <div className="fila" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <Link to="/productos" className="back-link"><Icon name="arrow_back" size="sm" />Volver a Productos</Link>
                {editando && actual && <span className="badge badge-neutral mono">ID REGISTRO: #{actual.id}</span>}
            </div>

            <div className="card page-head" style={{ background: "var(--surface-low)" }}>
                <div>
                    <div className="eyebrow">{editando ? "Edición de producto" : "Alta de producto"}</div>
                    <h1>{editando ? "Editar producto" : "Nuevo producto"}</h1>
                    <p className="muted" style={{ marginTop: "0.25rem" }}>
                        {editando
                            ? "Actualice la información comercial y el umbral de stock mínimo del producto."
                            : "Registre un producto con su código único, precio de venta y stock mínimo de alerta."}
                    </p>
                </div>
                {editando && actual && (
                    <div className="card card-pad-sm" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div>
                            <div className="metric-label">Stock actual</div>
                            <div className="mono" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{actual.stockActual} unid</div>
                        </div>
                        <StockBadge stockActual={actual.stockActual} stockBajo={actual.stockBajo} />
                    </div>
                )}
            </div>

            <form onSubmit={enviar} className="card card-pad stack" style={{ maxWidth: "52rem" }}>
                {error && <Message tipo="error" titulo="No se pudo guardar el producto" texto={error} onCerrar={() => setError(null)} />}

                <div className="form-grid">
                    <div className="field">
                        <div className="field-label">
                            <label htmlFor="codigo">Código de producto <span className="req">*</span></label>
                            {editando && <span className="metric-label">Inmutable</span>}
                        </div>
                        <div className="input-wrap">
                            <Icon name="barcode" />
                            <input id="codigo" className="input input-lg input-num" required maxLength={30}
                                value={form.codigo} disabled={editando}
                                onChange={(e) => cambiar("codigo", e.target.value)} placeholder="Ej. BEB-001" />
                        </div>
                        {editando && (
                            <p className="field-help"><Icon name="info" size="sm" /> El código no se puede modificar una vez creado.</p>
                        )}
                    </div>

                    <div className="field">
                        <div className="field-label">
                            <label htmlFor="nombre">Nombre del producto <span className="req">*</span></label>
                            <span className="counter">{form.nombre.length} / 150</span>
                        </div>
                        <input id="nombre" className="input input-lg" required maxLength={150} value={form.nombre}
                            onChange={(e) => cambiar("nombre", e.target.value)} placeholder="Ej. Gaseosa Inca Kola 1.5L" />
                    </div>

                    <div className="field col-span-2">
                        <div className="field-label">
                            <label htmlFor="descripcion">Descripción comercial</label>
                            <span className="counter">{descripcion.length} / 255</span>
                        </div>
                        <textarea id="descripcion" className="input" rows={3} maxLength={255} value={descripcion}
                            onChange={(e) => cambiar("descripcion", e.target.value)}
                            placeholder="Detalles sobre presentación, envase y colocación en estantería..." />
                    </div>

                    <div className="field">
                        <div className="field-label">
                            <label htmlFor="precio">Precio de venta (PEN) <span className="req">*</span></label>
                        </div>
                        <div className="input-wrap">
                            <span className="prefix">S/</span>
                            <input id="precio" className="input input-lg input-num has-prefix" required type="number"
                                min={0} step="0.01" value={form.precio}
                                onChange={(e) => cambiar("precio", Number(e.target.value))} />
                        </div>
                        <p className="field-help">Formato en Soles peruanos con 2 decimales.</p>
                    </div>

                    <div className="field">
                        <div className="field-label">
                            <label htmlFor="stockMinimo">Stock mínimo de alerta <span className="req">*</span></label>
                            <span className="badge badge-bajo">Reponer si ≤ {form.stockMinimo}</span>
                        </div>
                        <div className="input-wrap">
                            <Icon name="notifications_active" />
                            <input id="stockMinimo" className="input input-lg input-num" required type="number"
                                min={0} step={1} value={form.stockMinimo}
                                onChange={(e) => cambiar("stockMinimo", Number(e.target.value))} />
                        </div>
                        <p className="field-help">Cantidad mínima antes de activar la alerta de reposición.</p>
                    </div>
                </div>

                <div className="form-actions">
                    <Button type="button" variante="secundario" tamano="lg" onClick={() => navigate("/productos")}>
                        <Icon name="close" size="sm" />Cancelar
                    </Button>
                    <Button type="submit" tamano="lg" disabled={guardando}>
                        {guardando ? <span className="spinner" role="status" aria-label="Guardando" /> : <Icon name="save" size="sm" />}
                        {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Registrar producto"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
