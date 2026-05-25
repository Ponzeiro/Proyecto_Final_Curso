package com.tabletale.backend.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

public record ProductoUpdateDTO(
        String nombre,
        @DecimalMin("0.00") BigDecimal precio,
        String categoria,
        @Min(0) Integer cantidad
) {
}
