package com.tabletale.backend.repository;

import com.tabletale.backend.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {
}
