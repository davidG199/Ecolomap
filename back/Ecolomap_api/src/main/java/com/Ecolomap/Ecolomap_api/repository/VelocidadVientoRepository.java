package com.Ecolomap.Ecolomap_api.repository;

import com.Ecolomap.Ecolomap_api.model.VelocidadViento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VelocidadVientoRepository extends JpaRepository<VelocidadViento, Long> {

    @Query(value = "SELECT * FROM velocidad_viento LIMIT :limit", nativeQuery = true)
    List<VelocidadViento> findWithLimit(@Param("limit") int limit);

    @Query(value = "SELECT * FROM velocidad_viento WHERE departamento = :dep LIMIT :limit", nativeQuery = true)
    List<VelocidadViento> findByDepartamento(@Param("dep") String dep, @Param("limit") int limit);

    @Query(value = "SELECT * FROM velocidad_viento WHERE municipio = :dep LIMIT :limit", nativeQuery = true)
    List<VelocidadViento> findByMunicipio(@Param("mun") String mun, @Param("limit") int limit);

    @Query(value = "SELECT * FROM velocidad_viento WHERE codigo_estacion = :codigo LIMIT :limit", nativeQuery = true)
    List<VelocidadViento> findbyCodigoEstacion(@Param("codigo") String codigo, @Param("limit") int limit);

}
