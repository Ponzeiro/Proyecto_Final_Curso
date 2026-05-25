package com.tabletale.backend.mapper;

import com.tabletale.backend.model.Producto;
import com.tabletale.backend.model.dto.ProductoDTO;
import com.tabletale.backend.service.ProductoCategoriaNormalizer;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoDTO toDto(Producto producto) {
        if (producto == null) return null;
        return new ProductoDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getPrecio(),
                ProductoCategoriaNormalizer.normalize(producto.getCategoria()),
                producto.getCantidad()
        );
    }

    public Producto toEntity(ProductoDTO dto) {
        if (dto == null) return null;
        Producto producto = new Producto(dto.nombre(), dto.precio(), ProductoCategoriaNormalizer.normalize(dto.categoria()));
        producto.setCantidad(dto.cantidad());
        return producto;
    }
}
