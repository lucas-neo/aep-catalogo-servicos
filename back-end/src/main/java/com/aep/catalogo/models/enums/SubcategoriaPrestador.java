package com.aep.catalogo.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SubcategoriaPrestador {
    MECANICO("mecanico"),
    ELETRICISTA("eletricista"),
    ENCANADOR("encanador"),
    AR_CONDICIONADO("ar_condicionado"),
    ELETRODOMESTICOS("eletrodomesticos"),
    DIARISTA("diarista"),
    FAXINEIRA("faxineira"),
    JARDINEIRO("jardineiro"),
    PINTOR("pintor"),
    COSTUREIRA("costureira"),
    ALFAIATE("alfaiate"),
    PROFESSOR_PARTICULAR("professor_particular"),
    REFORCO_ESCOLAR("reforco_escolar"),
    TECNICO_INFORMATICA("tecnico_informatica"),
    MECANICO_AUTO("mecanico_auto"),
    CABELEIREIRO("cabeleireiro"),
    MANICURE("manicure");
    
    private final String value;
    
    SubcategoriaPrestador(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static SubcategoriaPrestador fromValue(String value) {
        for (SubcategoriaPrestador subcategoria : SubcategoriaPrestador.values()) {
            if (subcategoria.value.equals(value)) {
                return subcategoria;
            }
        }
        throw new IllegalArgumentException("Subcategoria inválida: " + value);
    }
}
