/**
 * API para SuperAdmin - Gestión global de entidades
 */
import apiClient from '../services/apiClient';

// ========== ADMINS ==========
export const getAdmins = () => apiClient.get('/admins/');
export const getAdminById = (id) => apiClient.get(`/admins/${id}`);
export const deleteAdmin = (id) => apiClient.delete(`/admins/${id}`);
export const updateAdmin = (id, data) => apiClient.put(`/admins/${id}`, data);

// ========== VENDEDORES ==========
export const getVendedores = () => apiClient.get('/vendedores/');
export const getVendedorById = (id) => apiClient.get(`/vendedores/${id}`);
export const deleteVendedor = (id) => apiClient.delete(`/vendedores/${id}`);
export const updateVendedor = (id, data) => apiClient.put(`/vendedores/${id}`, data);
export const bajaLogicaVendedor = (id) => apiClient.put(`/vendedores/${id}/baja-logica`);

// ========== SUPERADMINS ==========
export const getSuperadmins = () => apiClient.get('/superadmins/');
export const deleteSuperadmin = (id) => apiClient.delete(`/superadmins/${id}`);

// ========== PROVEEDORES (global) ==========
export const getProveedoresGlobal = (id_microempresa) =>
    apiClient.get(`/proveedores?id_microempresa=${id_microempresa}`);

// ========== CLIENTES (global) ==========
// Usa el endpoint existente que lista todos los clientes
export const getClientesGlobal = () => apiClient.get('/clientes/');
export const getClientesByMicroempresa = (id_microempresa) =>
    apiClient.get(`/clientes/microempresa/${id_microempresa}`);

// ========== PRODUCTOS (global) ==========
// El endpoint /productos/ lista todos los productos
export const getProductosGlobal = () => apiClient.get('/productos/');
export const getProductosByMicroempresa = (id_microempresa) =>
    apiClient.get(`/productos/microempresa/${id_microempresa}`);

// ========== CATEGORIAS (global) ==========
// El endpoint /productos/categorias/activas/global ya existe
export const getCategoriasGlobal = () => apiClient.get('/productos/categorias/activas/global');
export const getCategoriasByMicroempresa = (id_microempresa) =>
    apiClient.get(`/productos/categorias/activas/${id_microempresa}`);
