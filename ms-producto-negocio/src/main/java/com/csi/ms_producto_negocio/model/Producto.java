package com.csi.ms_producto_negocio.model;

import java.math.BigDecimal;

import com.csi.ms_producto_negocio.exception.StockInsuficienteException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "producto", schema = "sys")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_producto")
	private Long id;

	@Column(nullable = false, unique = true, length = 30)
	private String codigo;

	@Column(nullable = false, length = 150)
	private String nombre;

	@Column(length = 255)
	private String descripcion;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal precio;

	@Column(nullable = false, name = "stock_actual")
	private int stockActual;

	@Column(nullable = false, name = "stock_minimo")
	private int strockMinimo;

	@Column(nullable = false)
	private boolean activo = true;

	@Version
	private long version;

	public Producto() {

	}

	public void actualizarDatos(String nombre, String descripcion, BigDecimal precio, int stockMinimo) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precio = precio;
		this.strockMinimo = stockMinimo;
	}
	
	public Producto(String codigo, String nombre, String descripcion, BigDecimal precio, int strockMinimo) {
		
		this.codigo = codigo;
		this.actualizarDatos(nombre, descripcion, precio, strockMinimo);
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}

	public int getStockActual() {
		return stockActual;
	}

	public void setStockActual(int stockActual) {
		this.stockActual = stockActual;
	}

	public int getStrockMinimo() {
		return strockMinimo;
	}

	public void setStrockMinimo(int strockMinimo) {
		this.strockMinimo = strockMinimo;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}

	public void incrementarStock(int cantidad) {
		this.stockActual += cantidad;
		
	}

	public void disminuirStock(int cantidad) {
		if (cantidad > stockActual) {
			throw new StockInsuficienteException(codigo, stockActual, cantidad);
		}
		this.stockActual -= cantidad;
		
	}

	public boolean tieneStockBajo() {
		// TODO Auto-generated method stub
		return stockActual <= strockMinimo;
	}

	public void desactivar() {
		// TODO Auto-generated method stub
		this.activo = false;
	}

}
