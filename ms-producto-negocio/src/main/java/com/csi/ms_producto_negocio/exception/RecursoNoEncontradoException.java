package com.csi.ms_producto_negocio.exception;

public class RecursoNoEncontradoException extends RuntimeException  {

	private static final long serialVersionUID = 1L;

	public RecursoNoEncontradoException(String recurso, Long id) {
		super(recurso + " con id " + id + " no existe");
	}
}
