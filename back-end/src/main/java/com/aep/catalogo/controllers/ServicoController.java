package com.aep.catalogo.controllers;

import com.aep.catalogo.models.Servico;
import com.aep.catalogo.repositories.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "http://localhost:3000")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Servico> getAllServicos() {
        return servicoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> getServicoById(@PathVariable Long id) {
        return servicoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Servico createServico(@RequestBody Servico servico) {
        return servicoRepository.save(servico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> updateServico(@PathVariable Long id, @RequestBody Servico servicoDetails) {
        return servicoRepository.findById(id)
                .map(servico -> {
                    servico.setNome(servicoDetails.getNome());
                    servico.setDescricao(servicoDetails.getDescricao());
                    servico.setPreco(servicoDetails.getPreco());
                    servico.setPrestador(servicoDetails.getPrestador());
                    Servico updatedServico = servicoRepository.save(servico);
                    return ResponseEntity.ok(updatedServico);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteServico(@PathVariable Long id) {
        return servicoRepository.findById(id)
                .map(servico -> {
                    servicoRepository.delete(servico);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
