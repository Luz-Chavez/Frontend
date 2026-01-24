import axios from './axios';

// --- PROVEEDORES CRUD ---
export const getProveedores = (id_microempresa) => 
    axios.get(`/proveedores?id_microempresa=${id_microempresa}`);

export const createProveedor = (data) => axios.post('/proveedores', data);

export const updateProveedor = (id, data, id_microempresa) => 
    axios.put(`/proveedores/${id}?id_microempresa=${id_microempresa}`, data);

export const deleteProveedor = (id, id_microempresa) => 
    axios.patch(`/proveedores/${id}/estado?id_microempresa=${id_microempresa}`, { estado: false });

// --- GESTIÓN AVANZADA: MÉTODOS DE PAGO ---
export const getMetodosPago = (id_proveedor, id_microempresa) =>
    axios.get(`/proveedores/${id_proveedor}/metodos-pago?id_microempresa=${id_microempresa}`);

export const getMetodosPagoNoActivos = (id_proveedor, id_microempresa) =>
    axios.get(`/proveedores/${id_proveedor}/metodos-pago/no-activos?id_microempresa=${id_microempresa}`);

export const createMetodoPago = (id_proveedor, data, id_microempresa) =>
    axios.post(`/proveedores/${id_proveedor}/metodos-pago?id_microempresa=${id_microempresa}`, data);

export const toggleMetodoPago = (id_metodo, estado, id_microempresa) =>
    axios.patch(`/proveedores/metodos-pago/${id_metodo}/estado?id_microempresa=${id_microempresa}`, { activo: estado });

// --- GESTIÓN AVANZADA: PRODUCTOS ---
export const getProductosProveedor = (id_proveedor, id_microempresa) =>
    axios.get(`/proveedores/${id_proveedor}/productos?id_microempresa=${id_microempresa}`);

export const getProductosNoActivos = (id_proveedor, id_microempresa) =>
    axios.get(`/proveedores/${id_proveedor}/productos/no-activos?id_microempresa=${id_microempresa}`);

export const asociarProducto = (id_proveedor, data, id_microempresa) =>
    axios.post(`/proveedores/${id_proveedor}/productos?id_microempresa=${id_microempresa}`, data);

export const toggleProductoProveedor = (id_proveedor, id_producto, estado, id_microempresa) =>
    axios.patch(`/proveedores/${id_proveedor}/productos/${id_producto}/estado?id_microempresa=${id_microempresa}`, { activo: estado });

// Helper para llenar el select de productos disponibles
export const getProductosGlobales = (id_microempresa) => 
    axios.get(`/productos?id_microempresa=${id_microempresa}`);