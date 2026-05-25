package com.tabletale.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "comandas")
public class Comanda {

    @Id
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_mesa", nullable = false)
    private Mesa mesa;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_empleado", nullable = false)
    private Empleado empleado;

    @NotBlank
    @Column(nullable = false)
    private String estado;

    @NotNull
    @Column(nullable = false)
    private OffsetDateTime fecha;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    protected Comanda() {
    }

    public Comanda(Long id, Mesa mesa, Empleado empleado, String estado, OffsetDateTime fecha, BigDecimal total) {
        this.id = id;
        this.mesa = mesa;
        this.empleado = empleado;
        this.estado = estado;
        this.fecha = fecha;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public OffsetDateTime getFecha() {
        return fecha;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
