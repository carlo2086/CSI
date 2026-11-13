import { request } from "./api";
import type { Movimiento, MovimientoInput, Stock } from "../models/Inventario";

export const inventarioService = {
    registrarEntrada: (data: MovimientoInput) =>
        request<Movimiento>("/inventario/entradas", { method: "POST", body: JSON.stringify(data) }),
    registrarSalida: (data: MovimientoInput) =>
        request<Movimiento>("/inventario/salidas", { method: "POST", body: JSON.stringify(data) }),
    consultarStock: (productoId: number) =>
        request<Stock>(`/inventario/stock/${productoId}`),
    listarStockBajo: () => request<Stock[]>("/inventario/stock-bajo"),
    listarMovimientos: (productoId: number) =>
        request<Movimiento[]>(`/inventario/movimientos/${productoId}`),
};
