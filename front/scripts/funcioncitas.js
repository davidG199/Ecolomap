function distanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; //radio de la tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// let graficoGlobal;

export async function obtenerEstacionMasCercana(lat, lng) {
  const info = document.getElementById("info");
  info.textContent = "Buscando estación más cercana...";

  // const hoy = new Date();
  // const haceUnAnio = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate());
  // const fechaISO = haceUnAnio.toISOString().split("T")[0];
  const url = `http://localhost:8080/api/viento`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    // console.log("Datos obtenidos:", data);

    const estacionesFiltradas = data.filter((d) => {
      const LATOK =
        typeof d.latitud === "number" && typeof d.longitud === "number";
      const VALOROK = typeof d.valorObservado === "number";
      const VIENTOOK = d.descripcionSensor
        ?.toLowerCase()
        .trim()
        .includes("viento");

      return LATOK && VALOROK && VIENTOOK;
    });

    const estacionesMap = new Map();

    estacionesFiltradas.forEach((reg) => {
      const codigo = reg.codigoEstacion;
      if (!estacionesMap.has(codigo)) {
        estacionesMap.set(codigo, []);
      }
      estacionesMap.get(codigo).push(reg);
    });

    //calculamos la distancia
    const estacionesConDistancia = Array.from(estacionesMap.values()).map(
      (listaRegistros) => {
        const primerRegistro = listaRegistros[0]; // para lat/lng y nombre
        const dist = distanciaHaversine(
          lat,
          lng,
          primerRegistro.latitud,
          primerRegistro.longitud
        );
        return {
          codigo: primerRegistro.codigoEstacion,
          lat: primerRegistro.latitud,
          lng: primerRegistro.longitud,
          nombreEstacion: primerRegistro.nombreEstacion,
          departamento: primerRegistro.departamento,
          municipio: primerRegistro.municipio,
          registros: listaRegistros, // todos los registros de esa estación
          distancia: dist,
        };
      }
    );

    if (estacionesConDistancia.length === 0) {
      info.textContent = "No se encontraron estaciones cercanas.";
      return;
    }

    //tomamos la mas reciente
    estacionesConDistancia.sort((a, b) => a.distancia - b.distancia);
    const estacionCercana = estacionesConDistancia[0];

    // ✅ Ordenar registros de esa estación por fecha y tomar el más reciente
    const registrosOrdenados = estacionCercana.registros.sort(
      (a, b) => new Date(b.fechaObservacion) - new Date(a.fechaObservacion)
    );
    const masReciente = registrosOrdenados[0];

    info.innerHTML = `
      <strong>Nombre estación:</strong> ${estacionCercana.nombreEstacion}<br>
      <strong>Departamento:</strong> ${estacionCercana.departamento}<br>
      <strong>Municipio:</strong> ${estacionCercana.municipio}<br>
      <strong>Latitud:</strong> ${estacionCercana.lat.toFixed(6)}<br>
      <strong>Longitud:</strong> ${estacionCercana.lng.toFixed(6)}<br>
      <strong>Velocidad del viento:</strong> ${masReciente.valorObservado} m/s<br>
      <strong>Fecha de observación:</strong> ${new Date(masReciente.fechaObservacion).toLocaleString()}<br>
      <strong>Distancia al punto:</strong> ${estacionCercana.distancia.toFixed(2)} km
    `;

    // Guardar datos recientes para graficar
    const filtro =
      document.querySelector('input[name="tipo"]:checked')?.value || "año";
    const hoyFiltro = new Date();
    let inicioFiltro;

    if (filtro === "año") {
      inicioFiltro = new Date(
        hoyFiltro.getFullYear() - 1,
        hoyFiltro.getMonth(),
        hoyFiltro.getDate()
      );
    } else if (filtro === "mes") {
      inicioFiltro = new Date(
        hoyFiltro.getFullYear(),
        hoyFiltro.getMonth() - 1,
        hoyFiltro.getDate()
      );
    } else {
      inicioFiltro = new Date(hoyFiltro);
      inicioFiltro.setDate(hoyFiltro.getDate() - 2);
    }

    const datosFiltrados = registrosOrdenados
      .filter(r => new Date(r.fechaObservacion) >= inicioFiltro)
      .sort((a, b) => new Date(a.fechaObservacion) - new Date(b.fechaObservacion))
      .map(r => ({
        fecha: r.fechaObservacion,
        valor: parseFloat(r.valorObservado)
      }));

    window.datosGraficar = registrosOrdenados;
  } catch (error) {
    console.error(error);
    info.textContent = "Error al obtener los datos.";
  }
}

//boton para graficar
document.getElementById("btnGraficar").addEventListener("click", () => {
  if (!window.datosGraficar || window.datosGraficar.length === 0) {
    alert("No hay datos para graficar.");
    return;
  }

  localStorage.setItem("datosGrafica", JSON.stringify(window.datosGraficar));
  window.open("graficaCompleta.html", "_blank");
});
