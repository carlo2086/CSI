import type { Stock } from "../../models/Inventario";
import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";

interface Props {
    stockBajo: Stock[];
    onReabastecer: (s: Stock) => void;
}

export function ReposicionTab({ stockBajo, onReabastecer }: Props) {
    if (stockBajo.length === 0) {
        return (
            <div className="banner banner-ok">
                <div className="banner-left">
                    <div className="banner-icon"><Icon name="check" size="lg" /></div>
                    <div>
                        <h2>Stock en orden</h2>
                        <p>No hay productos por debajo de su stock mínimo.</p>
                    </div>
                </div>
            </div>
        );
    }

    const deficit = stockBajo.reduce((s, x) => s + Math.max(0, x.stockMinimo - x.stockActual), 0);
    const critico = stockBajo.reduce((a, b) => (b.stockMinimo - b.stockActual > a.stockMinimo - a.stockActual ? b : a));

    return (
        <div className="stack">
            <div className="banner">
                <div className="banner-left">
                    <div className="banner-icon"><Icon name="priority_high" size="lg" /></div>
                    <div>
                        <h2>Atención operativa urgente</h2>
                        <p>
                            <strong>{stockBajo.length} {stockBajo.length === 1 ? "producto requiere" : "productos requieren"}</strong>{" "}
                            reposición para evitar quiebre de stock.
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                        <div className="metric-label">Déficit acumulado</div>
                        <div className="mono t-danger" style={{ fontSize: "1.125rem", fontWeight: 700 }}>{deficit} unidades faltantes</div>
                    </div>
                    <Button variante="peligro" onClick={() => onReabastecer(critico)}>
                        <Icon name="add_shopping_cart" size="sm" />Abastecer el más crítico
                    </Button>
                </div>
            </div>

            <div className="cards-3">
                {stockBajo.map((s) => {
                    const falta = Math.max(0, s.stockMinimo - s.stockActual);
                    const pct = s.stockMinimo > 0 ? Math.min(100, Math.round((s.stockActual / s.stockMinimo) * 100)) : 0;
                    return (
                        <article key={s.productoId} className="card stock-card">
                            <div className="stock-card-body">
                                <div className="stock-card-row">
                                    <span className="badge badge-neutral mono">{s.codigo}</span>
                                    <span className="badge badge-bajo">
                                        <Icon name={s.stockActual <= 0 ? "error" : "warning"} size="sm" />
                                        {s.stockActual <= 0 ? "Agotado" : "Stock bajo"}
                                    </span>
                                </div>
                                <h3>{s.nombre}</h3>
                            </div>
                            <div className="stats-box">
                                <div className="stock-card-row">
                                    <span className="muted">Stock actual:</span>
                                    <span className="mono t-danger" style={{ fontSize: "1.125rem", fontWeight: 700 }}>{s.stockActual} und</span>
                                </div>
                                <div className="stock-card-row">
                                    <span className="muted">Mínimo requerido:</span>
                                    <span className="mono">{s.stockMinimo} und</span>
                                </div>
                                <div className="stock-card-row t-danger">
                                    <span className="metric-label t-danger">Déficit:</span>
                                    <span className="mono" style={{ fontWeight: 700 }}>Faltan {falta} und</span>
                                </div>
                                <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Stock respecto al mínimo">
                                    <span style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                            <Button variante="secundario" bloque onClick={() => onReabastecer(s)}>
                                <Icon name="add_circle" size="sm" />Reabastecer producto
                            </Button>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
