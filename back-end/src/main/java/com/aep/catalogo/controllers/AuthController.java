package com.aep.catalogo.controllers;

import com.aep.catalogo.models.User;
import com.aep.catalogo.models.Prestador;
import com.aep.catalogo.models.enums.TipoUsuario;
import com.aep.catalogo.models.enums.CategoriaPrestador;
import com.aep.catalogo.models.enums.SubcategoriaPrestador;
import com.aep.catalogo.dto.RegisterDTO;
import com.aep.catalogo.repositories.UserRepository;
import com.aep.catalogo.repositories.PrestadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PrestadorRepository prestadorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String senha = loginRequest.get("senha");
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getSenha().equals(senha)) {
                Map<String, Object> response = new HashMap<>();
                response.put("usuario", user);
                response.put("token", "token-simulado-" + System.currentTimeMillis());
                
                // Se o usuário for prestador, buscar seus dados de prestador
                if (user.getTipo() != null && user.getTipo().name().equals("PRESTADOR")) {
                    Optional<Prestador> prestadorOptional = prestadorRepository.findByUsuario(user);
                    prestadorOptional.ifPresent(prestador -> response.put("prestador", prestador));
                }
                
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        // Verificar se o email já existe
        Optional<User> existingUser = userRepository.findByEmail(registerDTO.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
        
        // Criar o usuário a partir do DTO
        User user = new User();
        user.setNome(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setSenha(registerDTO.getPassword());
        user.setTelefone(registerDTO.getTelefone());
        
        // Converter tipoUsuario string para enum
        try {
            user.setTipo(TipoUsuario.fromValue(registerDTO.getTipoUsuario()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Tipo de usuário inválido: " + registerDTO.getTipoUsuario());
        }
        
        user.setCriadoEm(LocalDateTime.now());
        user.setAtualizadoEm(LocalDateTime.now());
        user.setAtivo(true);
        
        User savedUser = userRepository.save(user);
        
        // Se for prestador, criar também o perfil de prestador
        Prestador prestador = null;
        if (TipoUsuario.PRESTADOR.equals(user.getTipo())) {
            prestador = new Prestador();
            prestador.setUsuario(savedUser);
            prestador.setNome(registerDTO.getName());
            prestador.setEmail(registerDTO.getEmail());
            prestador.setTelefone(registerDTO.getTelefone());
            prestador.setWhatsapp(registerDTO.getWhatsapp());
            prestador.setTitulo(registerDTO.getTitulo());
            prestador.setDescricao(registerDTO.getDescricao());
            
            // Converter categoria string para enum
            try {
                if (registerDTO.getCategoria() != null) {
                    prestador.setCategoria(CategoriaPrestador.fromValue(registerDTO.getCategoria()));
                }
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Categoria inválida: " + registerDTO.getCategoria());
            }
            
            prestador.setCidade(registerDTO.getCidade());
            prestador.setEstado(registerDTO.getEstado());
            prestador.setEndereco(registerDTO.getEndereco());
            prestador.setRaioAtendimento(registerDTO.getRaioAtendimento());
            prestador.setPrecoHora(registerDTO.getPrecoHora());
            prestador.setFotoPerfil(registerDTO.getFotoPerfil());
            
            // Converter lista de subcategorias string para Set<SubcategoriaPrestador>
            if (registerDTO.getSubcategorias() != null && !registerDTO.getSubcategorias().isEmpty()) {
                Set<SubcategoriaPrestador> subcategorias = new HashSet<>();
                try {
                    for (String subcat : registerDTO.getSubcategorias()) {
                        subcategorias.add(SubcategoriaPrestador.fromValue(subcat));
                    }
                    prestador.setSubcategorias(subcategorias);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Subcategoria inválida: " + e.getMessage());
                }
            }
            
            prestador.setCriadoEm(LocalDateTime.now());
            prestador.setAtualizadoEm(LocalDateTime.now());
            
            prestador = prestadorRepository.save(prestador);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("usuario", savedUser);
        response.put("token", "token-simulado-" + System.currentTimeMillis());
        if (prestador != null) {
            response.put("prestador", prestador);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
