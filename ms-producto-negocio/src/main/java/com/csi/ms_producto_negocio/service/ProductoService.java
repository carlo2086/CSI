package com.csi.ms_producto_negocio.service;

import java.util.List;

import com.csi.ms_producto_negocio.dto.ProductoRequest;
import com.csi.ms_producto_negocio.dto.ProductoResponse;

public interface ProductoService {

	List<ProductoResponse> listar();

	ProductoResponse buscarPorId(Long id);

	ProductoResponse crear(ProductoRequest request);

	ProductoResponse actualizar(Long id, ProductoRequest request);

	/** Baja lógica: conserva el historial de movimientos. */
	void desactivar(Long id);

}
