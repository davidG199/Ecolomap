package com.Ecolomap.Ecolomap_api.controller;


import com.Ecolomap.Ecolomap_api.model.VelocidadViento;
import org.springframework.web.bind.annotation.*;
import com.Ecolomap.Ecolomap_api.repository.VelocidadVientoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/viento")
public class VelocidadVientoController {

    private final VelocidadVientoRepository repository;

    public VelocidadVientoController(VelocidadVientoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VelocidadViento> getLimited(
            @RequestParam(name = "limit", defaultValue = "1000") int limit) {

        // No dejar pedir más de 100k
        if (limit > 100000) {
            limit = 100000;
        } else if (limit < 1) {
            limit = 1000;
        }
        List<VelocidadViento> datos = repository.findWithLimit(limit);
        System.out.println("Registros encontrados: " + datos.size());
        return datos;
    }

    @GetMapping("/departamento/{dep}")
    public List<VelocidadViento> getByDepartamento(
            @PathVariable String dep,
            @RequestParam(name = "limit", defaultValue = "1000") int limit) {

        if (limit > 100000) limit = 100000;
        if (limit < 1) limit = 1000;

        List<VelocidadViento> datos = repository.findByDepartamento(dep, limit);
        return datos;
    }

    @GetMapping("/municipio/{mun}")
    public List<VelocidadViento> getByMunicipio(
            @PathVariable String mun,
            @RequestParam(name = "limit", defaultValue = "1000") int limit) {

        if (limit > 100000) limit = 100000;
        if (limit < 1) limit = 1000;

        List<VelocidadViento> datos = repository.findByMunicipio(mun, limit);
        return datos;
    }

    @GetMapping("/estacion/{codigo}")
    public List<VelocidadViento> getByCodigoEstacion(
            @PathVariable String codigo,
            @RequestParam(name = "limit", defaultValue = "1000") int limit) {
        if (limit > 100000) limit = 100000;
        if (limit < 1) limit = 1000;

        List<VelocidadViento> datos = repository.findbyCodigoEstacion(codigo, limit);
        return datos;
    }
}


