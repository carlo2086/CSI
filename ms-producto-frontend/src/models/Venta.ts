export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  detalles: DetalleVenta[];
}

export type VentaInput = Omit<Venta, "id" | "fecha" | "total">;