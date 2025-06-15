package com.aep.catalogo.controllers;

import com.aep.catalogo.dto.AvaliacaoDTO;
import com.aep.catalogo.models.Avaliacao;
import com.aep.catalogo.models.Prestador;
import com.aep.catalogo.repositories.AvaliacaoRepository;
import com.aep.catalogo.repositories.PrestadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;
    
    @Autowired
    private PrestadorRepository prestadorRepository;

    @PostMapping
    public ResponseEntity<?> criarAvaliacao(@RequestBody AvaliacaoDTO avaliacaoDTO) {
        try {
            // Buscar o prestador
            Optional<Prestador> prestadorOpt = prestadorRepository.findById(avaliacaoDTO.getPrestadorId());
            if (!prestadorOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Prestador não encontrado");
            }

            // Por enquanto, vamos criar uma avaliação sem usuário específico
            // Em um sistema real, você pegaria o usuário da sessão/token
            Avaliacao avaliacao = new Avaliacao();
            avaliacao.setPrestador(prestadorOpt.get());
            avaliacao.setNota(avaliacaoDTO.getNota());
            avaliacao.setComentario(avaliacaoDTO.getComentario());

            // Salvar a avaliação
            Avaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);

            // Atualizar as estatísticas do prestador
            atualizarEstatisticasPrestador(avaliacaoDTO.getPrestadorId());

            return ResponseEntity.ok(avaliacaoSalva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar avaliação: " + e.getMessage());
        }
    }

    @GetMapping("/prestador/{prestadorId}")
    public List<Avaliacao> getAvaliacoesPorPrestador(@PathVariable Long prestadorId) {
        return avaliacaoRepository.findByPrestadorId(prestadorId);
    }

    private void atualizarEstatisticasPrestador(Long prestadorId) {
        Optional<Prestador> prestadorOpt = prestadorRepository.findById(prestadorId);
        if (prestadorOpt.isPresent()) {
            Prestador prestador = prestadorOpt.get();
            
            // Calcular nova média
            Double novaMedia = avaliacaoRepository.calcularMediaAvaliacaoPorPrestador(prestadorId);
            Long totalAvaliacoes = avaliacaoRepository.contarAvaliacoesPorPrestador(prestadorId);
            
            prestador.setAvaliacaoMedia(novaMedia != null ? novaMedia : 0.0);
            prestador.setTotalAvaliacoes(totalAvaliacoes != null ? totalAvaliacoes.intValue() : 0);
            
            prestadorRepository.save(prestador);
        }
    }
}
