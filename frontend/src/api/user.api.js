// Obtener clientes de una microempresa
export const getClientes = (id_microempresa) => apiClient.get(`/clientes?microempresa=${id_microempresa}`);
// Solicitar recuperación de contraseña
export const recoverPassword = (email) => apiClient.post('/auth/recover', { email });

// Resetear contraseña con token
export const resetPassword = (token, nueva_password) => apiClient.post('/auth/reset-password', { token, nueva_password });
import apiClient from '../services/apiClient';

// Obtener datos del usuario autenticado
export const getMeRequest = () => apiClient.get('/usuarios/me');

// Obtener todos los planes
export const getPlanesRequest = () => apiClient.get('/planes/');

// Obtener un plan por id
export const getPlanByIdRequest = (id) => apiClient.get(`/planes/${id}`);

// Solicitar token para cambio de contraseña
export const requestPasswordToken = (email) => apiClient.post('/auth/request-reset-password', { email });
