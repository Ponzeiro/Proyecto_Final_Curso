package com.tabletale.backend.controller;

import com.tabletale.backend.mapper.EmpleadoMapper;
import com.tabletale.backend.model.dto.EmpleadoDTO;
import com.tabletale.backend.service.interfaces.IEmpleadoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private IEmpleadoService empleadoService;

    @Autowired
    private EmpleadoMapper empleadoMapper;

    @GetMapping
    public List<EmpleadoDTO> listarEmpleados() {
        return empleadoService.showAllEmpleados().stream()
                .map(empleadoMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public EmpleadoDTO empleadoPorId(@PathVariable("id") Long id) {
        return empleadoMapper.toDto(empleadoService.showEmpleadoById(id));
    }
}
