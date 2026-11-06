package com.csi.ms_producto_negocio.service;

import java.util.List;

import com.csi.ms_producto_negocio.dto.MovimientoRequest;
import com.csi.ms_producto_negocio.dto.MovimientoResponse;
import com.csi.ms_producto_negocio.dto.StockResponse;

public interface InventarioService {
	MovimientoResponse registrarEntrada(MovimientoRequest request);

	MovimientoResponse registrarSalida(MovimientoRequest request);

	StockResponse consultarStock(Long productoId);

	List<StockResponse> listarStockBajo();

	List<MovimientoResponse> listarMovimientos(Long productoId);
}
