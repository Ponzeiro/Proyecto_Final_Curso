package com.tabletale.backend.repository;

import com.tabletale.backend.model.LineaComanda;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LineaComandaRepository extends JpaRepository<LineaComanda, Long> {

    List<LineaComanda> findByComandaId(Long idComanda);
}
