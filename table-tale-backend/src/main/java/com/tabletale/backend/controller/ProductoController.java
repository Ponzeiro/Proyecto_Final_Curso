package com.tabletale.backend.controller;

import com.tabletale.backend.mapper.ProductoMapper;
import com.tabletale.backend.model.Producto;
import com.tabletale.backend.model.dto.ProductoDTO;
import com.tabletale.backend.model.dto.ProductoUpdateDTO;
import com.tabletale.backend.service.interfaces.IProductoService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private IProductoService productoService;

    @Autowired
    private ProductoMapper productoMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoDTO addProducto(@Valid @RequestBody ProductoDTO productoDTO) {
        Producto producto = productoService.addProducto(productoDTO);
        return productoMapper.toDto(producto);
    }

    @GetMapping
    public List<ProductoDTO> listarProductos() {
        return productoService.showAllProductos().stream()
                .map(productoMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductoDTO productoPorId(@PathVariable("id") UUID id) {
        return productoMapper.toDto(productoService.showProductoById(id));
    }

    @PutMapping("/{id}")
    public ProductoDTO updateProducto(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ProductoUpdateDTO productoDTO
    ) {
        Producto updated = productoService.updateProducto(id, productoDTO);
        return productoMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProducto(@PathVariable("id") UUID id) {
        productoService.deleteProductoById(id);
    }
}
