package com.tabletale.backend.model.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record ComandaDTO(
        Long id,
        Long idMesa,
        Long idEmpleado,
        String estado,
        OffsetDateTime fecha,
        BigDecimal total
) {
}
