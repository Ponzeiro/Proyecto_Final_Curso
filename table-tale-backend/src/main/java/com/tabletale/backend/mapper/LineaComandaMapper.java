package com.tabletale.backend.mapper;

import com.tabletale.backend.model.LineaComanda;
import com.tabletale.backend.model.dto.LineaComandaDTO;
import org.springframework.stereotype.Component;

@Component
public class LineaComandaMapper {

    public LineaComandaDTO toDto(LineaComanda lineaComanda) {
        if (lineaComanda == null) return null;
        return new LineaComandaDTO(
                lineaComanda.getId(),
                lineaComanda.getComanda() != null ? lineaComanda.getComanda().getId() : null,
                lineaComanda.getIdProducto(),
                lineaComanda.getCantidad(),
                lineaComanda.getSubtotal()
        );
    }
}
