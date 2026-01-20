// Listar categorías activas
export const getCategoriasActivas = () =>
  apiClient.get('/productos/categoria/activas');

// Listar categorías inactivas
export const getCategoriasInactivas = () =>
  apiClient.get('/productos/categoria/inactivas');
// Listar todas las categorías existentes
export const getTodasCategorias = () =>
  apiClient.get('/productos/categoria');

// Obtener todas las categorías globales
export const getCategoriasGlobales = () =>
  apiClient.get('/productos/categoria/globales');

// Crear categoría global
export const crearCategoriaGlobal = (data) =>
  apiClient.post('/productos/categoria/', data);

// Editar categoría global
export const editarCategoriaGlobal = (id_categoria, data) =>
  apiClient.put(`/productos/categoria/${id_categoria}`, data);

// Activar categoría global
export const activarCategoriaGlobal = (id_categoria) =>
  apiClient.post(`/productos/categoria/${id_categoria}/activar`);

// Desactivar categoría global
export const desactivarCategoriaGlobal = (id_categoria) =>
  apiClient.post(`/productos/categoria/${id_categoria}/desactivar`);

// Eliminar categoría global
export const eliminarCategoriaGlobal = (id_categoria) =>
  apiClient.delete(`/productos/categoria/${id_categoria}`);
import apiClient from '../services/apiClient';

// Obtener categorías de una microempresa
export const getCategoriasByMicroempresa = (id_microempresa) =>
  apiClient.get(`/productos/categoria/microempresa/${id_microempresa}`);
