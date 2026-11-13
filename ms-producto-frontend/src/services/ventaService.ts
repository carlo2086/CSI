import { request } from "./api";
import type { Venta, VentaInput } from "../models/Venta";

export const ventaService = {
    listar: () => request<Venta[]>("/ventas"),
    obtener: (id: number) => request<Venta>(`/ventas/${id}`),
    registrar: (data: VentaInput) =>
        request<Venta>("/ventas", { method: "POST", body: JSON.stringify(data) }),
    eliminar: (id: number) => request<void>(`/ventas/${id}`, { method: "DELETE" }),
};
