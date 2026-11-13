export type TipoMovimiento = "ENTRADA" | "SALIDA";

export interface MovimientoInput {
  productoId: number;
  cantidad: number;
  motivo?: string;
}

export interface Movimiento {
  id: number;
  productoId: number;
  codigoProducto: string;
  tipo: TipoMovimiento;
  cantidad: number;
  stockResultante: number;
  motivo: string | null;
  fechaRegistro: string;
}

export interface Stock {
  productoId: number;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  stockBajo: boolean;
}
