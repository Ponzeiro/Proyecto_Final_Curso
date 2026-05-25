package com.tabletale.backend.model.dto;

public record EmpleadoDTO(
        Long id,
        String nombre,
        String rol,
        String pinAcceso
) {
}
