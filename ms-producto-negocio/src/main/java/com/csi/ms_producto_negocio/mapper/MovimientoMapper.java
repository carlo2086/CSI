package com.csi.ms_producto_negocio.mapper;

import org.springframework.stereotype.Component;

import com.csi.ms_producto_negocio.dto.MovimientoResponse;
import com.csi.ms_producto_negocio.model.MovimientoInventario;

@Component
public class MovimientoMapper {
	public MovimientoResponse toResponse(MovimientoInventario m) {
		return new MovimientoResponse(m.getId(), m.getProducto().getId(), m.getProducto().getCodigo(), m.getTipo(),
				m.getCantidad(), m.getStockResultante(), m.getMotivo(), m.getFechaRegistro());
	}
}
