import apiClient from '../services/apiClient';

export const getNotificaciones = () => apiClient.get('/notificaciones/');
export const markNotificacionLeida = (id) => apiClient.post(`/notificaciones/${id}/leida`);
export const markAllLeida = () => apiClient.post('/notificaciones/marcar-todas-leidas'); // Check if this exists
export const deleteNotificacion = (id) => apiClient.delete(`/notificaciones/${id}`);
export const getNotificacionesNoLeidas = (id_usuario) => apiClient.get(`/notificaciones/usuario/${id_usuario}/no-leidas`);

// Legacy support
export const getNotificacionesPorUsuario = (id_usuario) => apiClient.get(`/notificaciones/usuario/${id_usuario}`);
export const marcarNotificacionLeida = markNotificacionLeida;