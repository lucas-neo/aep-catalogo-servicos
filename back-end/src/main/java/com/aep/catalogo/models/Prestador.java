package com.aep.catalogo.models;

import javax.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Prestador {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nome;
    private String descricao;
    private String contato;
    
    @OneToMany(mappedBy = "prestador", cascade = CascadeType.ALL)
    private List<Servico> servicos;
}
