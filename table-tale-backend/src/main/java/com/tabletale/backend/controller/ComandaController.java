package com.tabletale.backend.controller;

import com.tabletale.backend.mapper.ComandaMapper;
import com.tabletale.backend.model.Comanda;
import com.tabletale.backend.model.dto.ComandaDTO;
import com.tabletale.backend.service.interfaces.IComandaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comandas")
public class ComandaController {

    @Autowired
    private IComandaService comandaService;

    @Autowired
    private ComandaMapper comandaMapper;

    @GetMapping
    public List<ComandaDTO> listarComandas() {
        return comandaService.showAllComandas().stream()
                .map(comandaMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ComandaDTO comandaPorId(@PathVariable("id") Long id) {
        return comandaMapper.toDto(comandaService.showComandaById(id));
    }

    @PostMapping
    public ComandaDTO addComanda(@Valid @RequestBody ComandaDTO comandaDTO) {
        Comanda comanda = comandaService.addComanda(comandaDTO);
        return comandaMapper.toDto(comanda);
    }

    @PostMapping("/{id}/pagar")
    public ComandaDTO pagarComanda(@PathVariable("id") Long id) {
        return comandaMapper.toDto(comandaService.pagarComanda(id));
    }
}
