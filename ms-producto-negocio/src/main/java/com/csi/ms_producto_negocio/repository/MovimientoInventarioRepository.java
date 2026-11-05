package com.csi.ms_producto_negocio.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.csi.ms_producto_negocio.model.MovimientoInventario;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

	List<MovimientoInventario> findByProductoIdOrderByFechaRegistroDesc(Long idProducto);
}