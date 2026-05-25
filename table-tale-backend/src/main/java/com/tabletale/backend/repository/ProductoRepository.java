package com.tabletale.backend.repository;

import com.tabletale.backend.model.Producto;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, UUID> {

    List<Producto> findAllByOrderByCategoriaAscNombreAsc();
}
