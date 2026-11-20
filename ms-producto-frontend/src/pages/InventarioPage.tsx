import { useCallback, useEffect, useState } from "react";
import { inventarioService } from "../services/inventarioService";
import { productoService } from "../services/productoService";
import type { Stock } from "../models/Inventario";
import type { Producto } from "../models/Producto";
import { Message } from "../components/Message";
import { Icon } from "../components/Icon";
import { ReposicionTab } from "./inventario/ReposicionTab";
import { MovimientoTab, type Preset } from "./inventario/MovimientoTab";
import { KardexTab } from "./inventario/KardexTab";

type Pestana = "reposicion" | "movimiento" | "kardex";

export function InventarioPage() {
    const [pestana, setPestana] = useState<Pestana>("reposicion");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [stockBajo, setStockBajo] = useState<Stock[]>([]);
    const [preset, setPreset] = useState<Preset | undefined>();
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        const [prods, bajo] = await Promise.all([productoService.listar(), inventarioService.listarStockBajo()]);
        setProductos(prods);
        setStockBajo(bajo);
    }, []);

    useEffect(() => {
        cargar().catch((e) => setError((e as Error).message));
    }, [cargar]);

    function reabastecer(s: Stock) {
        setPreset({ productoId: s.productoId, cantidad: Math.max(1, s.stockMinimo - s.stockActual) });
        setPestana("movimiento");
    }

    function irAMovimiento() {
        setPreset(undefined);
        setPestana("movimiento");
    }

    return (
        <section className="stack">
            <div>
                <div className="eyebrow"><Icon name="warehouse" size="sm" />Módulo operativo de stock</div>
                <h1>Inventario y Almacén</h1>
                <p className="muted">Control operativo de stock, abastecimiento y trazabilidad física de existencias.</p>
            </div>

            {error && <Message tipo="error" texto={error} onCerrar={() => setError(null)} />}

            <div className="tabs" role="tablist" aria-label="Secciones de inventario">
                <button role="tab" className="tab" aria-selected={pestana === "reposicion"} onClick={() => setPestana("reposicion")}>
                    <Icon name="warning" size="sm" />Reposición urgente
                    {stockBajo.length > 0 && <span className="pill">{stockBajo.length}</span>}
                </button>
                <button role="tab" className="tab" aria-selected={pestana === "movimiento"} onClick={irAMovimiento}>
                    <Icon name="swap_horiz" size="sm" />Registrar movimiento
                </button>
                <button role="tab" className="tab" aria-selected={pestana === "kardex"} onClick={() => setPestana("kardex")}>
                    <Icon name="history" size="sm" />Kardex e Historial
                </button>
            </div>

            <div role="tabpanel">
                {pestana === "reposicion" && <ReposicionTab stockBajo={stockBajo} onReabastecer={reabastecer} />}
                {pestana === "movimiento" && <MovimientoTab productos={productos} preset={preset} onRegistrado={cargar} />}
                {pestana === "kardex" && <KardexTab productos={productos} />}
            </div>
        </section>
    );
}
