package com.csi.ms_producto_negocio.dto;

public record StockResponse(
		Long productoId,
		String codigo,
		String nombre,
		int stockActual,
		int stockMinimo,
		boolean stockBajo) {
}