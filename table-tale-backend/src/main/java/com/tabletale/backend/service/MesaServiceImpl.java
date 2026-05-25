package com.tabletale.backend.service;

import com.tabletale.backend.model.Mesa;
import com.tabletale.backend.repository.MesaRepository;
import com.tabletale.backend.service.interfaces.IMesaService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MesaServiceImpl implements IMesaService {

    private final MesaRepository mesaRepo;

    public MesaServiceImpl(MesaRepository mesaRepo) {
        this.mesaRepo = mesaRepo;
    }

    @Override
    public List<Mesa> showAllMesas() {
        return mesaRepo.findAll();
    }

    @Override
    public Mesa showMesaById(Long id) {
        return mesaRepo.findById(id).orElse(null);
    }
}
