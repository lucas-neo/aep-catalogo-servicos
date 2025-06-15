package com.aep.catalogo.dto;

import lombok.Data;

@Data
public class AvaliacaoDTO {
    private Long prestadorId;
    private Double nota;
    private String comentario;
}
