package com.aep.catalogo.repositories;

import com.aep.catalogo.models.Prestador;
import com.aep.catalogo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PrestadorRepository extends JpaRepository<Prestador, Long> {
    Optional<Prestador> findByUsuario(User usuario);
}
