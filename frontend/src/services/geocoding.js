// Servicio de geocodificación simple usando Nominatim (OpenStreetMap)
// Uso: geocodeDireccion('Bolivia, La Paz, Ciudad de La Paz').then(({lat, lon}) => ...)
export async function geocodeDireccion(direccion) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
  const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
  const data = await resp.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  throw new Error('No se encontró la ubicación');
}
