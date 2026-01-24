import axios from './axios';

export const getCompras = (id_microempresa) => 
    axios.get(`/compras?id_microempresa=${id_microempresa}`);

export const getCompraDetalles = (id_compra) =>
    axios.get(`/compras/${id_compra}/detalles`);

export const createCompra = (data) => axios.post('/compras', data);