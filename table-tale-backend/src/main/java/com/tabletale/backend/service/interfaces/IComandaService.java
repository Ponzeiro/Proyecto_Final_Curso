package com.tabletale.backend.service.interfaces;

import com.tabletale.backend.model.Comanda;
import com.tabletale.backend.model.dto.ComandaDTO;
import java.util.List;

public interface IComandaService {

    List<Comanda> showAllComandas();

    Comanda showComandaById(Long id);

    Comanda addComanda(ComandaDTO dto);

    Comanda pagarComanda(Long id);
}
