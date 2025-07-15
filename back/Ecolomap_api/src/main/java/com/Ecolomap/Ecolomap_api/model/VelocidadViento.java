package com.Ecolomap.Ecolomap_api.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "velocidad_viento")
public class VelocidadViento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_estacion")
    private String codigoEstacion;

    @Column(name = "codigo_sensor")
    private String codigoSensor;

    @Column(name = "fecha_observacion")
    private LocalDateTime fechaObservacion;

    @Column(name = "valor_observado")
    private BigDecimal valorObservado;

    @Column(name = "nombre_estacion")
    private String nombreEstacion;

    @Column(name = "departamento")
    private String departamento;

    @Column(name = "municipio")
    private String municipio;

    @Column(name = "zona_hidrografica")
    private String zonaHidrografica;

    @Column(name = "latitud")
    private BigDecimal latitud;

    @Column(name = "longitud")
    private BigDecimal longitud;

    @Column(name = "descripcion_sensor")
    private String descripcionSensor;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoEstacion() { return codigoEstacion; }
    public void setCodigoEstacion(String codigoEstacion) { this.codigoEstacion = codigoEstacion; }

    public String getCodigoSensor() { return codigoSensor; }
    public void setCodigoSensor(String codigoSensor) { this.codigoSensor = codigoSensor; }

    public LocalDateTime getFechaObservacion() { return fechaObservacion; }
    public void setFechaObservacion(LocalDateTime fechaObservacion) { this.fechaObservacion = fechaObservacion; }

    public BigDecimal getValorObservado() { return valorObservado; }
    public void setValorObservado(BigDecimal valorObservado) { this.valorObservado = valorObservado; }

    public String getNombreEstacion() { return nombreEstacion; }
    public void setNombreEstacion(String nombreEstacion) { this.nombreEstacion = nombreEstacion; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }

    public String getZonaHidrografica() { return zonaHidrografica; }
    public void setZonaHidrografica(String zonaHidrografica) { this.zonaHidrografica = zonaHidrografica; }

    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }

    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }

    public String getDescripcionSensor() { return descripcionSensor; }
    public void setDescripcionSensor(String descripcionSensor) { this.descripcionSensor = descripcionSensor; }
}
