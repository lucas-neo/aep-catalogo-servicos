package com.aep.catalogo.models;

import javax.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonGetter;

import com.aep.catalogo.models.enums.CategoriaPrestador;
import com.aep.catalogo.models.enums.SubcategoriaPrestador;

@Data
@Entity
public class Prestador {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;
    
    private String nome;
    private String email;
    private String telefone;
    private String whatsapp;
    
    private String titulo;
    private String descricao;
    
    @Enumerated(EnumType.STRING)
    private CategoriaPrestador categoria;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    private Set<SubcategoriaPrestador> subcategorias;
    
    private String cidade;
    private String estado;
    private String endereco;
    private Integer raioAtendimento;
    
    private Double precoHora;
    private Double precoServico;
    private Boolean disponivel = true;
    
    private Double avaliacaoMedia = 0.0;
    private Integer totalAvaliacoes = 0;
    
    private String fotoPerfil;
    
    @JsonGetter("fotoPerfil")
    public String getFotoPerfilCompleta() {
        if (fotoPerfil != null && !fotoPerfil.startsWith("http")) {
            return "http://localhost:3001" + fotoPerfil;
        }
        return fotoPerfil;
    }
    
    @ElementCollection
    private List<String> fotos;
    
    @OneToMany(mappedBy = "prestador", cascade = CascadeType.ALL)
    private List<Servico> servicos;
    
    private LocalDateTime criadoEm = LocalDateTime.now();
    private LocalDateTime atualizadoEm = LocalDateTime.now();
}
