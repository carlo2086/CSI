package com.csi.ms_producto_negocio.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.csi.ms_producto_negocio.dto.MovimientoRequest;
import com.csi.ms_producto_negocio.dto.MovimientoResponse;
import com.csi.ms_producto_negocio.dto.StockResponse;
import com.csi.ms_producto_negocio.service.InventarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {
	private final InventarioService inventarioService;

	public InventarioController(InventarioService inventarioService) {
		this.inventarioService = inventarioService;
	}

	@PostMapping("/entradas")
	@ResponseStatus(HttpStatus.CREATED)
	public MovimientoResponse registrarEntrada(@Valid @RequestBody MovimientoRequest request) {
		return inventarioService.registrarEntrada(request);
	}

	@PostMapping("/salidas")
	@ResponseStatus(HttpStatus.CREATED)
	public MovimientoResponse registrarSalida(@Valid @RequestBody MovimientoRequest request) {
		return inventarioService.registrarSalida(request);
	}

	@GetMapping("/stock/{productoId}")
	public StockResponse consultarStock(@PathVariable Long productoId) {
		return inventarioService.consultarStock(productoId);
	}

	@GetMapping("/stock-bajo")
	public List<StockResponse> listarStockBajo() {
		return inventarioService.listarStockBajo();
	}

	@GetMapping("/movimientos/{productoId}")
	public List<MovimientoResponse> listarMovimientos(@PathVariable Long productoId) {
		return inventarioService.listarMovimientos(productoId);
	}
}
