package com.csi.ms_producto_negocio.exception;

public class ReglaNegocioException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public ReglaNegocioException(String mensaje) {
		super(mensaje);
	}
}
