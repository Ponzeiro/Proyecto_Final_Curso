package com.tabletale.backend.service;

import com.tabletale.backend.model.Empleado;
import com.tabletale.backend.repository.EmpleadoRepository;
import com.tabletale.backend.service.interfaces.IEmpleadoService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoServiceImpl implements IEmpleadoService {

    private final EmpleadoRepository empleadoRepo;

    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepo) {
        this.empleadoRepo = empleadoRepo;
    }

    @Override
    public List<Empleado> showAllEmpleados() {
        return empleadoRepo.findAll();
    }

    @Override
    public Empleado showEmpleadoById(Long id) {
        return empleadoRepo.findById(id).orElse(null);
    }
}
