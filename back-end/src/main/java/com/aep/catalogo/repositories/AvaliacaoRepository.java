package com.aep.catalogo.repositories;

import com.aep.catalogo.models.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    
    List<Avaliacao> findByPrestadorId(Long prestadorId);
    
    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.prestador.id = :prestadorId")
    Double calcularMediaAvaliacaoPorPrestador(@Param("prestadorId") Long prestadorId);
    
    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.prestador.id = :prestadorId")
    Long contarAvaliacoesPorPrestador(@Param("prestadorId") Long prestadorId);
}
