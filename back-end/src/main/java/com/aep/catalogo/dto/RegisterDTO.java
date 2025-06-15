package com.aep.catalogo.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterDTO {
    // Campos básicos do usuário
    private String tipoUsuario;
    private String name;
    private String email;
    private String password;
    private String telefone;
    private String whatsapp;
    
    // Campos específicos para prestador
    private String cpf;
    private String titulo;
    private String categoria;
    private List<String> subcategorias;
    private String descricao;
    private Integer anosExperiencia;
    private String cep;
    private String cidade;
    private String estado;
    private String endereco;
    private Integer raioAtendimento;
    private Double precoHora;
    private String fotoPerfil;
}
