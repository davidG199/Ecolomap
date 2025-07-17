// === Configuración global ===
const PRECIO_KWH = 0.1; // Precio por kWh en USD
const turbinas = [
  { nombre: "Vestas V52", min: 4, max: 12, produccionBase: 850, coef: 0.35 },
  {
    nombre: "Siemens SG 3.4",
    min: 6,
    max: 15,
    produccionBase: 3400,
    coef: 0.4,
  },
  { nombre: "GE 1.5s", min: 5, max: 13, produccionBase: 1500, coef: 0.38 },
];

let mapa, marcador, chart;
let ultimaVelocidadSeleccionada = null;
let datosHistorial = []; // para graficar

// === Inicializar mapa ===
export function inicializarMapa(callbackClick) {
  mapa = L.map("mapa", {
    center: [4.5709, -74.2973],
    zoom: 6,
    minZoom: 6,
    maxZoom: 17,
    maxBounds: [
      [13.5, -82],
      [-4.5, -65],
    ],
    maxBoundsViscosity: 1.0,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap",
  }).addTo(mapa);

  mapa.on("click", (e) => {
    const { lat, lng } = e.latlng;

    if (marcador) marcador.setLatLng(e.latlng);
    else marcador = L.marker(e.latlng).addTo(mapa);

    callbackClick(lat, lng);
  });
}

// === Distancia Haversine ===
function distanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

// === Elegir turbina más adecuada ===
function elegirTurbina(velocidad) {
  let mejor = turbinas.find((t) => velocidad >= t.min && velocidad <= t.max);
  if (!mejor) {
    mejor = turbinas.reduce((prev, curr) =>
      Math.abs(curr.min - velocidad) < Math.abs(prev.min - velocidad)
        ? curr
        : prev
    );
  }
  return mejor;
}

// === Producción energética ===
function calcularProduccion(velocidad, filtro, turbina) {
  const horas = filtro === "weekly" ? 24 * 7 : 24;
  const energia = Math.pow(velocidad, 3) * turbina.coef * horas;
  return Math.round(energia);
}

// === Predicción ===
function actualizarPrediccion(velocidad, filtro) {
  const turbina = elegirTurbina(velocidad);
  const produccion = calcularProduccion(velocidad, filtro, turbina);
  const ganancia = Math.round(produccion * PRECIO_KWH);

  document.getElementById("velocidadProm").textContent = velocidad.toFixed(1);
  document.getElementById("tipoTurbina").textContent = turbina.nombre;
  document.getElementById("produccion").textContent =
    produccion.toLocaleString();
  document.getElementById("ganancia").textContent = ganancia.toLocaleString();
}

// === Filtrar historial según filtro ===
function filtrarHistorial(historial, filtro) {
  const ahora = new Date();
  let inicio;
  if (filtro === "daily") inicio = new Date(ahora - 24 * 60 * 60 * 1000);
  else if (filtro === "weekly")
    inicio = new Date(ahora - 7 * 24 * 60 * 60 * 1000);
  else inicio = new Date(ahora - 3 * 60 * 60 * 1000); // recent = últimas 3h

  return historial.filter((r) => new Date(r.fechaObservacion) >= inicio);
}

// === Graficar ===
function graficar(historial) {
  const labels = historial.map((d) =>
    new Date(d.fechaObservacion).toLocaleString()
  );
  const valores = historial.map((d) => d.valor);

  const ctx = document.getElementById("grafico").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Velocidad del viento (m/s)",
          data: valores,
          borderColor: "#2e86de",
          backgroundColor: "rgba(46,134,222,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { maxTicksLimit: 6 } }, y: { beginAtZero: true } },
    },
  });
}

// === Obtener estación más cercana ===
export async function obtenerEstacionMasCercana(lat, lng) {
  const info = document.getElementById("info");
  info.textContent = "Buscando estación más cercana...";
  const filtroSeleccionado =
    document.getElementById("data_option_choose").value;
  // window.registrosEstacionActual = registrosOrdenados;

  try {
    const res = await fetch("http://localhost:8080/api/viento");
    const data = await res.json();

    const estaciones = data.filter(
      (d) =>
        typeof d.latitud === "number" &&
        typeof d.longitud === "number" &&
        typeof d.valorObservado === "number" &&
        d.descripcionSensor?.toLowerCase().includes("viento")
    );

    if (!estaciones.length) {
      info.textContent = "No se encontraron estaciones cercanas.";
      return;
    }

    const estacionesConDistancia = estaciones
      .map((est) => ({
        ...est,
        distancia: distanciaHaversine(lat, lng, est.latitud, est.longitud),
      }))
      .sort((a, b) => a.distancia - b.distancia);

    const masCercana = estacionesConDistancia[0];

    info.innerHTML = `
      <strong>Estación:</strong> ${
        masCercana.nombreEstacion || "Sin nombre"
      }<br>
      <strong>Departamento:</strong> ${masCercana.departamento || "-"}<br>
      <strong>Municipio:</strong> ${masCercana.municipio || "-"}<br>
      <strong>Lat/Lon:</strong> ${masCercana.latitud}, ${
      masCercana.longitud
    }<br>
      <strong>Velocidad:</strong> ${masCercana.valorObservado} m/s<br>
      <strong>Fecha:</strong> ${new Date(
        masCercana.fechaObservacion
      ).toLocaleString()}<br>
      <strong>Distancia:</strong> ${masCercana.distancia.toFixed(2)} km
    `;

    // Guardar última velocidad
    ultimaVelocidadSeleccionada = parseFloat(masCercana.valorObservado);
    actualizarPrediccion(ultimaVelocidadSeleccionada, filtroSeleccionado);

    // Obtener historial de esta estación
    const histRes = await fetch(
      `http://localhost:8080/api/viento/estacion/${masCercana.codigoEstacion}?limit=500`
    );
    const historialData = await histRes.json();

    datosHistorial = historialData.map((r) => ({
      fechaObservacion: r.fechaObservacion,
      valor: parseFloat(r.valorObservado),
    }));

    const filtrados = filtrarHistorial(datosHistorial, filtroSeleccionado);
    graficar(filtrados);
  } catch (error) {
    console.error(error);
    info.textContent = "Error al obtener datos.";
  }
}

// === Recalcular al cambiar filtro ===
document.getElementById("data_option_choose").addEventListener("change", () => {
  const filtro = document.getElementById("data_option_choose").value;

  // if (window.registrosEstacionActual) {
  //   actualizarSegunFiltro(window.registrosEstacionActual);
  // }

  if (datosHistorial.length) {
    const filtrados = filtrarHistorial(datosHistorial, filtro);
    graficar(filtrados);

    // Calcular velocidad promedio del filtro
    let velocidadPromedio;
    if (filtro === "recent") {
      // Usar la última velocidad seleccionada
      velocidadPromedio = ultimaVelocidadSeleccionada;
    } else {
      // Calcular promedio de los datos filtrados
      const valores = filtrados.map((d) => d.valor);
      velocidadPromedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    }

    if (velocidadPromedio) {
      actualizarPrediccion(velocidadPromedio, filtro);
    }
  }
});

// === Botón ver gráfica completa ===
document.getElementById("btnGraficar").addEventListener("click", () => {
  if (!datosHistorial.length) return alert("No hay datos para graficar.");
  localStorage.setItem("datosGrafica", JSON.stringify(datosHistorial));
  window.open("graficaCompleta.html", "_blank");
});
