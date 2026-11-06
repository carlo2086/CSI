package com.csi.ms_producto_negocio.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csi.ms_producto_negocio.dto.MovimientoRequest;
import com.csi.ms_producto_negocio.dto.MovimientoResponse;
import com.csi.ms_producto_negocio.dto.StockResponse;
import com.csi.ms_producto_negocio.exception.RecursoNoEncontradoException;
import com.csi.ms_producto_negocio.exception.ReglaNegocioException;
import com.csi.ms_producto_negocio.mapper.MovimientoMapper;
import com.csi.ms_producto_negocio.mapper.ProductoMapper;
import com.csi.ms_producto_negocio.model.MovimientoInventario;
import com.csi.ms_producto_negocio.model.Producto;
import com.csi.ms_producto_negocio.model.TipoMovimiento;
import com.csi.ms_producto_negocio.repository.MovimientoInventarioRepository;
import com.csi.ms_producto_negocio.repository.ProductoRepository;
import com.csi.ms_producto_negocio.service.InventarioService;

@Service
@Transactional
public class InventarioServiceImpl implements InventarioService  {

	private final ProductoRepository productoRepository;
	private final MovimientoInventarioRepository movimientoRepository;
	private final ProductoMapper productoMapper;
	private final MovimientoMapper movimientoMapper;

	public InventarioServiceImpl(ProductoRepository productoRepository,
			MovimientoInventarioRepository movimientoRepository, ProductoMapper productoMapper,
			MovimientoMapper movimientoMapper) {
		this.productoRepository = productoRepository;
		this.movimientoRepository = movimientoRepository;
		this.productoMapper = productoMapper;
		this.movimientoMapper = movimientoMapper;
	}

	@Override
	public MovimientoResponse registrarEntrada(MovimientoRequest request) {
		return registrar(TipoMovimiento.ENTRADA, request);
	}

	@Override
	public MovimientoResponse registrarSalida(MovimientoRequest request) {
		return registrar(TipoMovimiento.SALIDA, request);
	}

	@Override
	@Transactional(readOnly = true)
	public StockResponse consultarStock(Long productoId) {
		return productoMapper.toStockResponse(obtenerProducto(productoId));
	}

	@Override
	@Transactional(readOnly = true)
	public List<StockResponse> listarStockBajo() {
		return productoRepository.findConStockBajo().stream().map(productoMapper::toStockResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<MovimientoResponse> listarMovimientos(Long productoId) {
		obtenerProducto(productoId);
		return movimientoRepository.findByProductoIdOrderByFechaRegistroDesc(productoId).stream()
				.map(movimientoMapper::toResponse).toList();
	}

	private MovimientoResponse registrar(TipoMovimiento tipo, MovimientoRequest request) {
		Producto producto = obtenerProducto(request.productoId());
		if (!producto.isActivo()) {
			throw new ReglaNegocioException("El producto " + producto.getCodigo() + " está inactivo");
		}
		tipo.aplicar(producto, request.cantidad());
		MovimientoInventario movimiento = new MovimientoInventario(producto, tipo, request.cantidad(),
				request.motivo());
		return movimientoMapper.toResponse(movimientoRepository.save(movimiento));
	}

	private Producto obtenerProducto(Long id) {
		return productoRepository.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
	}
}
