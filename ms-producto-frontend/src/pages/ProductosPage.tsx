import { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import type { Producto } from "../models/Producto";
import { SearchBar } from "../components/SearchBar";
import { Message } from "../components/Message";
import { Button } from "../components/Button";
import { formatearMoneda } from "../utils/formatters";

export function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    async function eliminar(id: number) {
        if (!confirm("¿Eliminar este producto?")) return;
        try {
            await productoService.eliminar(id);
            await cargar();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    const filtrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <section>
            <h1>Productos</h1>
            <SearchBar valor={busqueda} onChange={setBusqueda} />
            {error && <Message tipo="error" texto={error} />}
            {cargando ? (
                <p>Cargando...</p>
            ) : (
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Precio</th><th></th></tr>
                    </thead>
                    <tbody>
                        {filtrados.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{formatearMoneda(p.precio)}</td>
                                <td><Button variante="peligro" onClick={() => eliminar(p.id)}>Eliminar</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}