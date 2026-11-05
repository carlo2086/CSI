package com.csi.ms_producto_negocio.dto;

import java.math.BigDecimal;

public record ProductoResponse(Long id,
		String codigo,
		String nombre,
		String descripcion,
		BigDecimal precio,
		int stockActual,
		int stockMinimo,
		boolean stockBajo,
		boolean activo) {

}
