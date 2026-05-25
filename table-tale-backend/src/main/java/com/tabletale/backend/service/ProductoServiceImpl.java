package com.tabletale.backend.service;

import com.tabletale.backend.model.Producto;
import com.tabletale.backend.model.dto.ProductoDTO;
import com.tabletale.backend.model.dto.ProductoUpdateDTO;
import com.tabletale.backend.repository.ProductoRepository;
import com.tabletale.backend.service.interfaces.IProductoService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ProductoServiceImpl implements IProductoService {

    private final ProductoRepository productoRepo;

    public ProductoServiceImpl(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }

    @Override
    @Transactional
    public Producto addProducto(ProductoDTO dto) {
        Producto producto = new Producto(
                dto.nombre().trim(),
                dto.precio(),
                ProductoCategoriaNormalizer.normalize(dto.categoria())
        );
        producto.setCantidad(dto.cantidad() != null ? dto.cantidad() : 100);
        return productoRepo.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> showAllProductos() {
        return productoRepo.findAllByOrderByCategoriaAscNombreAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public Producto showProductoById(UUID id) {
        return productoRepo.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Producto updateProducto(UUID id, ProductoUpdateDTO dto) {
        Producto actual = productoRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id " + id));

        if (StringUtils.hasText(dto.nombre())) {
            actual.setNombre(dto.nombre().trim());
        }
        if (dto.precio() != null) {
            actual.setPrecio(dto.precio());
        }
        if (StringUtils.hasText(dto.categoria())) {
            actual.setCategoria(ProductoCategoriaNormalizer.normalize(dto.categoria()));
        }
        if (dto.cantidad() != null) {
            actual.setCantidad(dto.cantidad());
        }
        return productoRepo.save(actual);
    }

    @Override
    @Transactional
    public void deleteProductoById(UUID id) {
        if (!productoRepo.existsById(id)) {
            throw new EntityNotFoundException("Producto no encontrado con id " + id);
        }
        productoRepo.deleteById(id);
    }
}
