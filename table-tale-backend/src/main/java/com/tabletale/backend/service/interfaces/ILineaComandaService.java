package com.tabletale.backend.service.interfaces;

import com.tabletale.backend.model.LineaComanda;
import com.tabletale.backend.model.dto.LineaComandaDTO;
import java.util.List;

public interface ILineaComandaService {

    List<LineaComanda> showAllLineasComandas();

    LineaComanda showLineaComandaById(Long id);

    LineaComanda addLineaComanda(LineaComandaDTO dto);

    LineaComanda updateLineaComanda(Long id, LineaComandaDTO dto);

    void deleteLineaComandaById(Long id);
}
