const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

/** S/ 1,450.50 */
export const formatearMoneda = (valor: number) => moneda.format(valor);

/** dd/mm/aaaa */
export const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });

/** 23/10/2024, 14:30 */
export const formatearFechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

/** Fecha local yyyy-mm-dd de un ISO (para comparar con <input type="date">). */
export const aFechaLocal = (iso: string) => {
  const d = new Date(iso);
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};
