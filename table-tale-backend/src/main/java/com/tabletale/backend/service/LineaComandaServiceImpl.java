package com.tabletale.backend.service;

import com.tabletale.backend.model.Comanda;
import com.tabletale.backend.model.LineaComanda;
import com.tabletale.backend.model.dto.LineaComandaDTO;
import com.tabletale.backend.repository.ComandaRepository;
import com.tabletale.backend.repository.LineaComandaRepository;
import com.tabletale.backend.service.interfaces.ILineaComandaService;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LineaComandaServiceImpl implements ILineaComandaService {

    private final LineaComandaRepository lineaComandaRepo;
    private final ComandaRepository comandaRepo;

    public LineaComandaServiceImpl(
            LineaComandaRepository lineaComandaRepo,
            ComandaRepository comandaRepo
    ) {
        this.lineaComandaRepo = lineaComandaRepo;
        this.comandaRepo = comandaRepo;
    }

    @Override
    public List<LineaComanda> showAllLineasComandas() {
        return lineaComandaRepo.findAll();
    }

    @Override
    public LineaComanda showLineaComandaById(Long id) {
        return lineaComandaRepo.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public LineaComanda addLineaComanda(LineaComandaDTO dto) {
        Comanda comanda = comandaRepo.findById(dto.idComanda())
                .orElseThrow(() -> new EntityNotFoundException("Comanda no encontrada con id " + dto.idComanda()));

        LineaComanda linea = new LineaComanda(
                dto.id(),
                comanda,
                dto.idProducto(),
                dto.cantidad(),
                dto.subtotal()
        );
        LineaComanda guardada = lineaComandaRepo.save(linea);
        recalcularTotalComanda(comanda.getId());
        return guardada;
    }

    @Override
    @Transactional
    public LineaComanda updateLineaComanda(Long id, LineaComandaDTO dto) {
        LineaComanda actual = lineaComandaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Linea no encontrada con id " + id));
        actual.setCantidad(dto.cantidad());
        actual.setSubtotal(dto.subtotal());
        LineaComanda guardada = lineaComandaRepo.save(actual);
        recalcularTotalComanda(actual.getComanda().getId());
        return guardada;
    }

    @Override
    @Transactional
    public void deleteLineaComandaById(Long id) {
        LineaComanda linea = lineaComandaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Linea no encontrada con id " + id));
        Long idComanda = linea.getComanda().getId();
        if (!lineaComandaRepo.existsById(id)) {
            throw new EntityNotFoundException("Linea no encontrada con id " + id);
        }
        lineaComandaRepo.deleteById(id);
        recalcularTotalComanda(idComanda);
    }

    private void recalcularTotalComanda(Long idComanda) {
        Comanda comanda = comandaRepo.findById(idComanda)
                .orElseThrow(() -> new EntityNotFoundException("Comanda no encontrada con id " + idComanda));
        BigDecimal total = lineaComandaRepo.findByComandaId(idComanda).stream()
                .map(LineaComanda::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        comanda.setTotal(total);
        comandaRepo.save(comanda);
    }
}
