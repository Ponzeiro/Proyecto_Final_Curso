package com.tabletale.backend.mapper;

import com.tabletale.backend.model.Comanda;
import com.tabletale.backend.model.dto.ComandaDTO;
import org.springframework.stereotype.Component;

@Component
public class ComandaMapper {

    public ComandaDTO toDto(Comanda comanda) {
        if (comanda == null) return null;
        return new ComandaDTO(
                comanda.getId(),
                comanda.getMesa() != null ? comanda.getMesa().getId() : null,
                comanda.getEmpleado() != null ? comanda.getEmpleado().getId() : null,
                comanda.getEstado(),
                comanda.getFecha(),
                comanda.getTotal()
        );
    }
}
