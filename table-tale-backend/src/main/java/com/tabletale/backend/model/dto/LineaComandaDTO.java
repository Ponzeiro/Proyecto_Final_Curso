package com.tabletale.backend.model.dto;

import java.math.BigDecimal;
public record LineaComandaDTO(
        Long id,
        Long idComanda,
        Long idProducto,
        Integer cantidad,
        BigDecimal subtotal
) {
}
