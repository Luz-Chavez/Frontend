import axios from "./axios";

export async function getClientesInfo(ids) {
  // ids: array de id_cliente
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  const peticiones = uniqueIds.map(id => axios.get(`/clientes/${id}`));
  try {
    const results = await Promise.all(peticiones);
    // Retorna un diccionario: { id_cliente: {nombre, email, ...} }
    const info = {};
    results.forEach((res, idx) => {
      info[uniqueIds[idx]] = res.data;
    });
    return info;
  } catch (e) {
    return {};
  }
}
