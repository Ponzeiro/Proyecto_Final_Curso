package com.tabletale.backend.service.interfaces;

import com.tabletale.backend.model.Empleado;
import java.util.List;

public interface IEmpleadoService {

    List<Empleado> showAllEmpleados();

    Empleado showEmpleadoById(Long id);
}
