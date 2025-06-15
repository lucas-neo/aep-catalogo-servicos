package com.aep.catalogo.controllers;

import com.aep.catalogo.models.Prestador;
import com.aep.catalogo.models.enums.CategoriaPrestador;
import com.aep.catalogo.models.enums.SubcategoriaPrestador;
import com.aep.catalogo.repositories.PrestadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prestadores")
public class PrestadorController {

    @Autowired
    private PrestadorRepository prestadorRepository;

    @GetMapping
    public List<Prestador> getAllPrestadores(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String subcategoria,
            @RequestParam(required = false) String cidade,
            @RequestParam(required = false) Double precoMin,
            @RequestParam(required = false) Double precoMax,
            @RequestParam(required = false) Double avaliacaoMin,
            @RequestParam(required = false) Boolean disponivel
    ) {
        List<Prestador> prestadores = prestadorRepository.findAll();
        
        // Converter strings para enums se necessário
        CategoriaPrestador categoriaEnum = null;
        if (categoria != null) {
            try {
                categoriaEnum = CategoriaPrestador.fromValue(categoria);
            } catch (IllegalArgumentException e) {
                // Categoria inválida, ignorar o filtro
            }
        }
        
        SubcategoriaPrestador subcategoriaEnum = null;
        if (subcategoria != null) {
            try {
                subcategoriaEnum = SubcategoriaPrestador.fromValue(subcategoria);
            } catch (IllegalArgumentException e) {
                // Subcategoria inválida, ignorar o filtro
            }
        }
        
        // Aplicar filtros
        final CategoriaPrestador finalCategoriaEnum = categoriaEnum;
        final SubcategoriaPrestador finalSubcategoriaEnum = subcategoriaEnum;
        
        return prestadores.stream()
                .filter(p -> finalCategoriaEnum == null || p.getCategoria() == finalCategoriaEnum)
                .filter(p -> finalSubcategoriaEnum == null || p.getSubcategorias().contains(finalSubcategoriaEnum))
                .filter(p -> cidade == null || p.getCidade().equalsIgnoreCase(cidade))
                .filter(p -> precoMin == null || (p.getPrecoHora() != null && p.getPrecoHora() >= precoMin))
                .filter(p -> precoMax == null || (p.getPrecoHora() != null && p.getPrecoHora() <= precoMax))
                .filter(p -> avaliacaoMin == null || p.getAvaliacaoMedia() >= avaliacaoMin)
                .filter(p -> disponivel == null || p.getDisponivel().equals(disponivel))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prestador> getPrestadorById(@PathVariable Long id) {
        return prestadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/busca")
    public List<Prestador> buscarPorTermo(@RequestParam String q) {
        List<Prestador> prestadores = prestadorRepository.findAll();
        
        // Filtrar por termo de busca
        return prestadores.stream()
                .filter(p -> 
                    p.getNome().toLowerCase().contains(q.toLowerCase()) ||
                    p.getDescricao().toLowerCase().contains(q.toLowerCase()) ||
                    p.getTitulo().toLowerCase().contains(q.toLowerCase()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Prestador createPrestador(@RequestBody Prestador prestador) {
        prestador.setCriadoEm(LocalDateTime.now());
        prestador.setAtualizadoEm(LocalDateTime.now());
        return prestadorRepository.save(prestador);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prestador> updatePrestador(@PathVariable Long id, @RequestBody Prestador prestadorDetails) {
        return prestadorRepository.findById(id)
                .map(prestador -> {
                    // Atualizar todos os campos relevantes
                    prestador.setNome(prestadorDetails.getNome());
                    prestador.setEmail(prestadorDetails.getEmail());
                    prestador.setTelefone(prestadorDetails.getTelefone());
                    prestador.setWhatsapp(prestadorDetails.getWhatsapp());
                    prestador.setTitulo(prestadorDetails.getTitulo());
                    prestador.setDescricao(prestadorDetails.getDescricao());
                    prestador.setCategoria(prestadorDetails.getCategoria());
                    prestador.setSubcategorias(prestadorDetails.getSubcategorias());
                    prestador.setCidade(prestadorDetails.getCidade());
                    prestador.setEstado(prestadorDetails.getEstado());
                    prestador.setEndereco(prestadorDetails.getEndereco());
                    prestador.setRaioAtendimento(prestadorDetails.getRaioAtendimento());
                    prestador.setPrecoHora(prestadorDetails.getPrecoHora());
                    prestador.setPrecoServico(prestadorDetails.getPrecoServico());
                    prestador.setDisponivel(prestadorDetails.getDisponivel());
                    prestador.setFotoPerfil(prestadorDetails.getFotoPerfil());
                    prestador.setFotos(prestadorDetails.getFotos());
                    prestador.setAtualizadoEm(LocalDateTime.now());
                    
                    Prestador updatedPrestador = prestadorRepository.save(prestador);
                    return ResponseEntity.ok(updatedPrestador);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrestador(@PathVariable Long id) {
        return prestadorRepository.findById(id)
                .map(prestador -> {
                    prestadorRepository.delete(prestador);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
