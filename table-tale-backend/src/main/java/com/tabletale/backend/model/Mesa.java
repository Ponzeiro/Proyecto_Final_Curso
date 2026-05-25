package com.tabletale.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "numero_mesa", nullable = false)
    private Integer numeroMesa;

    @NotBlank
    @Column(nullable = false)
    private String estado;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer capacidad;

    @NotBlank
    @Column(nullable = false)
    private String zona;

    protected Mesa() {
    }

    public Mesa(Integer numeroMesa, String estado, Integer capacidad, String zona) {
        this.numeroMesa = numeroMesa;
        this.estado = estado;
        this.capacidad = capacidad;
        this.zona = zona;
    }

    public Long getId() {
        return id;
    }

    public Integer getNumeroMesa() {
        return numeroMesa;
    }

    public String getEstado() {
        return estado;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public String getZona() {
        return zona;
    }
}
