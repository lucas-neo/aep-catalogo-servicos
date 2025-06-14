package com.aep.catalogo.repositories;

import com.aep.catalogo.models.Prestador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestadorRepository extends JpaRepository<Prestador, Long> {
}
