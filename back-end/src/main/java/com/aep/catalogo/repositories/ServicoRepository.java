package com.aep.catalogo.repositories;

import com.aep.catalogo.models.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
}
