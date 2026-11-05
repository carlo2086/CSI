package com.csi.ms_producto_negocio.dto;

import java.time.LocalDateTime;

import com.csi.ms_producto_negocio.model.TipoMovimiento;

public record MovimientoResponse(
		Long id,
		Long productoId,
		String codigoProducto,
		TipoMovimiento tipo,
		int cantidad,
		int stockResultante,
		String motivo,
		LocalDateTime fechaRegistro) {
}
