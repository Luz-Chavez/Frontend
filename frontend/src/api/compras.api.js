
import axios from './axios';
// Descargar PDF de una compra
export const descargarCompraPDF = (id_compra) =>
    axios.get(`/compras/${id_compra}/pdf`, { responseType: 'blob' });

export const getCompras = (id_microempresa) => 
    axios.get(`/compras?id_microempresa=${id_microempresa}`);

export const getCompraDetalles = (id_compra) =>
    axios.get(`/compras/${id_compra}/detalles`);

export const createCompra = (data) => axios.post('/compras', data);