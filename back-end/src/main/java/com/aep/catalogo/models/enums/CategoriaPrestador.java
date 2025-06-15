package com.aep.catalogo.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaPrestador {
    MANUTENCAO_REPARO("manutencao_reparo"),
    CASA_LIMPEZA("casa_limpeza"),
    MODA_COSTURA("moda_costura"),
    EDUCACAO("educacao"),
    TECNOLOGIA("tecnologia"),
    AUTOMOTIVO("automotivo"),
    BELEZA_BEM_ESTAR("beleza_bem_estar");
    
    private final String value;
    
    CategoriaPrestador(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static CategoriaPrestador fromValue(String value) {
        for (CategoriaPrestador categoria : CategoriaPrestador.values()) {
            if (categoria.value.equals(value)) {
                return categoria;
            }
        }
        throw new IllegalArgumentException("Categoria inválida: " + value);
    }
}
