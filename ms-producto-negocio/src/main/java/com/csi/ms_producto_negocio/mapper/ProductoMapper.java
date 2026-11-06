package com.csi.ms_producto_negocio.mapper;

import org.springframework.stereotype.Component;

import com.csi.ms_producto_negocio.dto.ProductoRequest;
import com.csi.ms_producto_negocio.dto.ProductoResponse;
import com.csi.ms_producto_negocio.dto.StockResponse;
import com.csi.ms_producto_negocio.model.Producto;

@Component
public class ProductoMapper {
	public Producto toEntity(ProductoRequest request) {
		return new Producto(request.codigo(), request.nombre(), request.descripcion(), request.precio(),
				request.stockMinimo());
	}

	public ProductoResponse toResponse(Producto p) {
		return new ProductoResponse(p.getId(), p.getCodigo(), p.getNombre(), p.getDescripcion(), p.getPrecio(),
				p.getStockActual(), p.getStockMinimo(), p.tieneStockBajo(), p.isActivo());
	}

	public StockResponse toStockResponse(Producto p) {
		return new StockResponse(p.getId(), p.getCodigo(), p.getNombre(), p.getStockActual(), p.getStockMinimo(),
				p.tieneStockBajo());
	}
}
