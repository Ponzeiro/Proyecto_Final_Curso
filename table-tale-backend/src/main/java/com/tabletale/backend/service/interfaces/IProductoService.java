package com.tabletale.backend.service.interfaces;

import com.tabletale.backend.model.Producto;
import com.tabletale.backend.model.dto.ProductoDTO;
import com.tabletale.backend.model.dto.ProductoUpdateDTO;
import java.util.List;
import java.util.UUID;

public interface IProductoService {

    Producto addProducto(ProductoDTO dto);

    List<Producto> showAllProductos();

    Producto showProductoById(UUID id);

    Producto updateProducto(UUID id, ProductoUpdateDTO dto);

    void deleteProductoById(UUID id);
}
