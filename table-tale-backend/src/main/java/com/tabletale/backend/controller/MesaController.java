package com.tabletale.backend.controller;

import com.tabletale.backend.mapper.MesaMapper;
import com.tabletale.backend.model.dto.MesaDTO;
import com.tabletale.backend.service.interfaces.IMesaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private IMesaService mesaService;

    @Autowired
    private MesaMapper mesaMapper;

    @GetMapping
    public List<MesaDTO> listarMesas() {
        return mesaService.showAllMesas().stream()
                .map(mesaMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public MesaDTO mesaPorId(@PathVariable("id") Long id) {
        return mesaMapper.toDto(mesaService.showMesaById(id));
    }
}
