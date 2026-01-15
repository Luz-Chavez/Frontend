import apiClient from '../services/apiClient';

// Obtener datos del usuario autenticado
export const getMeRequest = () => apiClient.get('/usuarios/me');

// Obtener todos los planes
export const getPlanesRequest = () => apiClient.get('/planes/');

// Obtener un plan por id
export const getPlanByIdRequest = (id) => apiClient.get(`/planes/${id}`);
