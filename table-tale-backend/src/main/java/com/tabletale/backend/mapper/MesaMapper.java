package com.tabletale.backend.mapper;

import com.tabletale.backend.model.Mesa;
import com.tabletale.backend.model.dto.MesaDTO;
import org.springframework.stereotype.Component;

@Component
public class MesaMapper {

    public MesaDTO toDto(Mesa mesa) {
        if (mesa == null) return null;
        return new MesaDTO(
                mesa.getId(),
                mesa.getNumeroMesa(),
                mesa.getEstado(),
                mesa.getCapacidad(),
                mesa.getZona()
        );
    }
}
