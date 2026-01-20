// Activar producto (POST /productos/{id_producto}/activar)
export const activarProducto = (id_producto) =>
  apiClient.post(`/productos/${id_producto}/activar`);

// Desactivar producto (POST /productos/{id_producto}/desactivar)
export const desactivarProducto = (id_producto) =>
  apiClient.post(`/productos/${id_producto}/desactivar`);
// Listar productos activos por microempresa
export const getProductosActivosPorMicroempresa = (id_microempresa) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/activos`);

// Listar productos inactivos sin stock por microempresa
export const getProductosInactivosSinStockPorMicroempresa = (id_microempresa) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/inactivos-sin-stock`);
import apiClient from '../services/apiClient';

// Obtener productos activos con stock para una microempresa (adminmicroempresa)
export const getProductosActivosConStock = (id_microempresa) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/activos-con-stock`);

// Crear producto (requiere id_microempresa en el body)
export const crearProducto = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return apiClient.post('/productos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Actualizar producto (PUT /productos/{id_producto})
export const actualizarProducto = (id_producto, data) =>
  apiClient.put(`/productos/${id_producto}`, data);

// Eliminar producto (DELETE /productos/{id_producto})
export const eliminarProductoFisico = (id_producto) =>
  apiClient.delete(`/productos/${id_producto}`);

// Obtener producto por id (GET /productos/{id_producto})
export const getProductoById = (id_producto) =>
  apiClient.get(`/productos/${id_producto}`);

// Listar productos activos
export const getProductosActivos = () =>
  apiClient.get('/productos/activos');

// Listar productos inactivos
export const getProductosInactivos = () =>
  apiClient.get('/productos/inactivos');

// Listar productos con stock
export const getProductosConStock = () =>
  apiClient.get('/productos/con-stock');

// Listar productos sin stock
// Listar productos sin stock por microempresa
export const getProductosSinStockPorMicroempresa = (id_microempresa) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/sin-stock`);
