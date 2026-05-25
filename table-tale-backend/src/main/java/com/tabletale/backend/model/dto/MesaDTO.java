package com.tabletale.backend.model.dto;

public record MesaDTO(
        Long id,
        Integer numeroMesa,
        String estado,
        Integer capacidad,
        String zona
) {
}
