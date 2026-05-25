package com.tabletale.backend.model.vo;

import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public record Money(BigDecimal value) {
}
