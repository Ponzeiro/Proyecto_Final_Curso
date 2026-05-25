package com.tabletale.backend.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductoDTO(
        UUID id,
        @NotBlank String nombre,
        @NotNull @DecimalMin("0.00") BigDecimal precio,
        @NotBlank String categoria,
        @Min(0) Integer cantidad
) {
}
