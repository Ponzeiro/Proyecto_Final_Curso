package com.tabletale.backend.controller;

import com.tabletale.backend.mapper.LineaComandaMapper;
import com.tabletale.backend.model.LineaComanda;
import com.tabletale.backend.model.dto.LineaComandaDTO;
import com.tabletale.backend.service.interfaces.ILineaComandaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lineas-comandas")
public class LineaComandaController {

    @Autowired
    private ILineaComandaService lineaComandaService;

    @Autowired
    private LineaComandaMapper lineaComandaMapper;

    @GetMapping
    public List<LineaComandaDTO> listarLineasComandas() {
        return lineaComandaService.showAllLineasComandas().stream()
                .map(lineaComandaMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public LineaComandaDTO lineaComandaPorId(@PathVariable("id") Long id) {
        return lineaComandaMapper.toDto(lineaComandaService.showLineaComandaById(id));
    }

    @PostMapping
    public LineaComandaDTO addLineaComanda(@Valid @RequestBody LineaComandaDTO lineaComandaDTO) {
        LineaComanda lineaComanda = lineaComandaService.addLineaComanda(lineaComandaDTO);
        return lineaComandaMapper.toDto(lineaComanda);
    }

    @PutMapping("/{id}")
    public LineaComandaDTO updateLineaComanda(
            @PathVariable("id") Long id,
            @Valid @RequestBody LineaComandaDTO lineaComandaDTO
    ) {
        LineaComanda updated = lineaComandaService.updateLineaComanda(id, lineaComandaDTO);
        return lineaComandaMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLineaComanda(@PathVariable("id") Long id) {
        lineaComandaService.deleteLineaComandaById(id);
    }
}
