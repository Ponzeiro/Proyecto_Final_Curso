package com.tabletale.backend.mapper;

import com.tabletale.backend.model.Empleado;
import com.tabletale.backend.model.dto.EmpleadoDTO;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper {

    public EmpleadoDTO toDto(Empleado empleado) {
        if (empleado == null) return null;
        return new EmpleadoDTO(
                empleado.getId(),
                empleado.getNombre(),
                empleado.getRol(),
                empleado.getPinAcceso()
        );
    }
}
