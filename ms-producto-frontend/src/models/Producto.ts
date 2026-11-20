export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  stockBajo: boolean;
  activo: boolean;
}

export interface ProductoInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stockMinimo: number;
}
