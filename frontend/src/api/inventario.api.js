import apiClient from '../services/apiClient';

// Crear stock para un producto
export const crearStock = (data) =>
  apiClient.post('/inventario/', data);

// Obtener stock por id_stock
export const getStockById = (id_stock) =>
  apiClient.get(`/inventario/${id_stock}`);

// Obtener stock por id_producto
export const getStockByProducto = (id_producto) =>
  apiClient.get(`/inventario/producto/${id_producto}`);
