import { request } from "./api";
import type { Producto, ProductoInput } from "../models/Producto";

export const productoService = {
    listar: () => request<Producto[]>("/productos"),
    obtener: (id: number) => request<Producto>(`/productos/${id}`),
    crear: (data: ProductoInput) =>
        request<Producto>("/productos", { method: "POST", body: JSON.stringify(data) }),
    actualizar: (id: number, data: ProductoInput) =>
        request<Producto>(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    eliminar: (id: number) => request<void>(`/productos/${id}`, { method: "DELETE" }),
};