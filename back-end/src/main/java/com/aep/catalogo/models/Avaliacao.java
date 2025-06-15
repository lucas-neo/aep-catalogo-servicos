package com.aep.catalogo.models;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "prestador_id")
    private Prestador prestador;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;
    
    private Double nota; // 1.0 a 5.0
    private String comentario;
    
    private LocalDateTime criadoEm = LocalDateTime.now();
    private LocalDateTime atualizadoEm = LocalDateTime.now();
}
