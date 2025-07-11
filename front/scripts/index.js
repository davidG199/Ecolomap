const API_TOKEN = "96zheuouf4jl07fda4xw37fsa";
const API_URL = "https://www.datos.gov.co/resource/sgfv-3yp8.json";

async function obtenerDatos(api_url, api_token) {
  try {
    const response = await fetch(api_url, {
      headers: {
        "X-App-Token": api_token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con el fetch:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await obtenerDatos(API_URL, API_TOKEN);
  console.log("Datos obtenidos:", data);
});
