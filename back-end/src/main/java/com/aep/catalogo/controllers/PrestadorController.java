package com.aep.catalogo.controllers;

import com.aep.catalogo.models.Prestador;
import com.aep.catalogo.repositories.PrestadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestadores")
@CrossOrigin(origins = "http://localhost:3000")
public class PrestadorController {

    @Autowired
    private PrestadorRepository prestadorRepository;

    @GetMapping
    public List<Prestador> getAllPrestadores() {
        return prestadorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prestador> getPrestadorById(@PathVariable Long id) {
        return prestadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Prestador createPrestador(@RequestBody Prestador prestador) {
        return prestadorRepository.save(prestador);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prestador> updatePrestador(@PathVariable Long id, @RequestBody Prestador prestadorDetails) {
        return prestadorRepository.findById(id)
                .map(prestador -> {
                    prestador.setNome(prestadorDetails.getNome());
                    prestador.setDescricao(prestadorDetails.getDescricao());
                    prestador.setContato(prestadorDetails.getContato());
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
