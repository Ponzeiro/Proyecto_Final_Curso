package com.tabletale.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "empleados")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String rol;

    @NotBlank
    @Column(name = "pin_acceso", nullable = false)
    private String pinAcceso;

    protected Empleado() {
    }

    public Empleado(String nombre, String rol, String pinAcceso) {
        this.nombre = nombre;
        this.rol = rol;
        this.pinAcceso = pinAcceso;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getRol() {
        return rol;
    }

    public String getPinAcceso() {
        return pinAcceso;
    }
}
