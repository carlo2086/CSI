export const formatearMoneda = (valor: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(valor);

export const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE");