package com.Ecolomap.Ecolomap_api.repository;

import com.Ecolomap.Ecolomap_api.model.VelocidadViento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VelocidadVientoRepository extends JpaRepository<VelocidadViento, Long> {

    @Query(value = "SELECT * FROM velocidad_viento LIMIT :limit", nativeQuery = true)
    List<VelocidadViento> findWithLimit(@Param("limit") int limit);

    List<VelocidadViento> findByDepartamento(String departamento);
    List<VelocidadViento> findByMunicipio(String municipio);

}
