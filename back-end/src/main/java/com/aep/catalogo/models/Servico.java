package com.aep.catalogo.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nome;
    private String descricao;
    private Double preco;
    
    @ManyToOne
    @JoinColumn(name = "prestador_id")
    private Prestador prestador;
}
