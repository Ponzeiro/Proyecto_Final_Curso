package com.tabletale.backend.service.interfaces;

import com.tabletale.backend.model.Mesa;
import java.util.List;

public interface IMesaService {

    List<Mesa> showAllMesas();

    Mesa showMesaById(Long id);
}
