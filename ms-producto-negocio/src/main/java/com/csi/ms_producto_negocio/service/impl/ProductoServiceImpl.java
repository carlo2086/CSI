package com.csi.ms_producto_negocio.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.csi.ms_producto_negocio.dto.ProductoRequest;
import com.csi.ms_producto_negocio.dto.ProductoResponse;
import com.csi.ms_producto_negocio.exception.RecursoNoEncontradoException;
import com.csi.ms_producto_negocio.exception.ReglaNegocioException;
import com.csi.ms_producto_negocio.mapper.ProductoMapper;
import com.csi.ms_producto_negocio.model.Producto;
import com.csi.ms_producto_negocio.repository.ProductoRepository;
import com.csi.ms_producto_negocio.service.ProductoService;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

	private final ProductoRepository productRepo;
	private final ProductoMapper productMapper;

	public ProductoServiceImpl(ProductoRepository _productoRepo, ProductoMapper _productoMapper) {
		this.productRepo = _productoRepo;
		this.productMapper = _productoMapper;

	}

	@Override
	@Transactional(readOnly = true)
	public List<ProductoResponse> listar() {
		// TODO Auto-generated method stub
		return productRepo.findByActivoTrue().stream().map(productMapper::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public ProductoResponse buscarPorId(Long id) {
		// TODO Auto-generated method stub
		// return productRepo.findById(id);
		return productMapper.toResponse(obtener(id));
	}

	private Producto obtener(Long id) {
		// TODO Auto-generated method stub
		return productRepo.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
	}

	@Override
	public ProductoResponse crear(ProductoRequest request) {
		if (productRepo.existsByCodigo(request.codigo())) {
			throw new ReglaNegocioException("Ya existe un producto con el código " + request.codigo());
		}
		Producto guardado = productRepo.save(productMapper.toEntity(request));
		return productMapper.toResponse(guardado);
	}

	@Override
	public ProductoResponse actualizar(Long id, ProductoRequest request) {
		// TODO Auto-generated method stub
		Producto producto = obtener(id);
		if (!producto.getCodigo().equals(request.codigo())) {
			throw new ReglaNegocioException("El código del producto no puede modificarse");
		}
		producto.actualizarDatos(request.nombre(), request.descripcion(), request.precio(), request.stockMinimo());
		return productMapper.toResponse(producto);
	}

	@Override
	public void desactivar(Long id) {
		// TODO Auto-generated method stub
		obtener(id).desactivar();
	}

}
