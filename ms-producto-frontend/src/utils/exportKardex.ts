import { formatearFechaHora } from "./formatters";

export interface FilaKardex {
  fecha: string;
  codigo: string;
  producto: string;
  tipo: "ENTRADA" | "SALIDA";
  cantidad: number;
  stockResultante: number;
  motivo: string;
}

const COLUMNAS = ["Fecha y hora", "Código", "Producto", "Tipo", "Cantidad", "Stock resultante", "Motivo"];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function tablaHtml(filas: FilaKardex[]) {
  const cabecera = COLUMNAS.map((c) => `<th>${c}</th>`).join("");
  const cuerpo = filas
    .map((f) => {
      const celdas = [
        formatearFechaHora(f.fecha), f.codigo, f.producto, f.tipo === "ENTRADA" ? "Entrada" : "Salida",
        String(f.tipo === "ENTRADA" ? f.cantidad : -f.cantidad), String(f.stockResultante), f.motivo,
      ];
      return `<tr>${celdas.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`;
    })
    .join("");
  return `<table border="1" cellspacing="0" cellpadding="4"><thead><tr>${cabecera}</tr></thead><tbody>${cuerpo}</tbody></table>`;
}

function descargar(contenido: string, tipo: string, nombre: string) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

/** Excel abre este HTML como hoja de cálculo (.xls); no requiere dependencias. */
export function exportarExcel(filas: FilaKardex[], periodo: string) {
  const html = `<html><head><meta charset="utf-8"></head><body><h3>Kardex de movimientos — ${esc(periodo)}</h3>${tablaHtml(filas)}</body></html>`;
  descargar(html, "application/vnd.ms-excel;charset=utf-8", "kardex.xls");
}

/** Abre el kardex en una ventana lista para imprimir o guardar como PDF. */
export function exportarPdf(filas: FilaKardex[], periodo: string) {
  const entradas = filas.filter((f) => f.tipo === "ENTRADA").reduce((s, f) => s + f.cantidad, 0);
  const salidas = filas.filter((f) => f.tipo === "SALIDA").reduce((s, f) => s + f.cantidad, 0);
  const w = window.open("", "_blank");
  if (!w) throw new Error("El navegador bloqueó la ventana de impresión. Permita las ventanas emergentes.");
  w.document.write(`<html><head><meta charset="utf-8"><title>Kardex</title>
    <style>body{font-family:Inter,system-ui,sans-serif;font-size:12px;padding:24px}
    table{border-collapse:collapse;width:100%}th,td{border:1px solid #c3c6d7;padding:4px 6px;text-align:left}
    th{background:#eff4ff}</style></head><body>
    <h2>Bodega Control Operativo — Kardex de movimientos</h2>
    <p>Período: ${esc(periodo)} · Entradas: +${entradas} · Salidas: -${salidas} · Registros: ${filas.length}</p>
    ${tablaHtml(filas)}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
