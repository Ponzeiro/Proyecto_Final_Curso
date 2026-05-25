package com.tabletale.backend.service;

import com.tabletale.backend.model.Comanda;
import com.tabletale.backend.model.Empleado;
import com.tabletale.backend.model.Mesa;
import com.tabletale.backend.model.dto.ComandaDTO;
import com.tabletale.backend.repository.ComandaRepository;
import com.tabletale.backend.repository.EmpleadoRepository;
import com.tabletale.backend.service.interfaces.IComandaService;
import com.tabletale.backend.repository.MesaRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ComandaServiceImpl implements IComandaService {

    private final ComandaRepository comandaRepo;
    private final MesaRepository mesaRepo;
    private final EmpleadoRepository empleadoRepo;

    public ComandaServiceImpl(
            ComandaRepository comandaRepo,
            MesaRepository mesaRepo,
            EmpleadoRepository empleadoRepo
    ) {
        this.comandaRepo = comandaRepo;
        this.mesaRepo = mesaRepo;
        this.empleadoRepo = empleadoRepo;
    }

    @Override
    public List<Comanda> showAllComandas() {
        return comandaRepo.findAll();
    }

    @Override
    public Comanda showComandaById(Long id) {
        return comandaRepo.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Comanda addComanda(ComandaDTO dto) {
        Mesa mesa = mesaRepo.findById(dto.idMesa())
                .orElseThrow(() -> new EntityNotFoundException("Mesa no encontrada con id " + dto.idMesa()));
        Empleado empleado = empleadoRepo.findById(dto.idEmpleado())
                .orElseThrow(() -> new EntityNotFoundException("Empleado no encontrado con id " + dto.idEmpleado()));

        Comanda comanda = new Comanda(
                dto.id(),
                mesa,
                empleado,
                dto.estado() != null ? dto.estado() : "Abierta",
                dto.fecha() != null ? dto.fecha() : OffsetDateTime.now(),
                dto.total() != null ? dto.total() : BigDecimal.ZERO
        );
        return comandaRepo.save(comanda);
    }

    @Override
    @Transactional
    public Comanda pagarComanda(Long id) {
        Comanda comanda = comandaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comanda no encontrada con id " + id));
        comanda.setEstado("Pagada");
        return comandaRepo.save(comanda);
    }
}
