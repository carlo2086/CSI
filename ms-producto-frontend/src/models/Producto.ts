export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
}

export type ProductoInput = Omit<Producto, "id">;