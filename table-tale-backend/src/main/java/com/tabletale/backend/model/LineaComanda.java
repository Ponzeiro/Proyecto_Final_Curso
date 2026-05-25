package com.tabletale.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "lineas_comandas")
public class LineaComanda {

    @Id
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_comanda", nullable = false)
    private Comanda comanda;

    @NotNull
    @Column(name = "id_producto", nullable = false)
    private Long idProducto;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer cantidad;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    protected LineaComanda() {
    }

    public LineaComanda(Long id, Comanda comanda, Long idProducto, Integer cantidad, BigDecimal subtotal) {
        this.id = id;
        this.comanda = comanda;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }

    public Long getId() {
        return id;
    }

    public Comanda getComanda() {
        return comanda;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
