import apiClient from "./axios"; // Asegúrate de que importas tu cliente axios configurado

// Obtener notificaciones de un usuario específico
export const getNotificacionesPorUsuario = (id_usuario) =>
    apiClient.get(`/notificaciones/usuario/${id_usuario}`);

// Marcar notificación como leída
export const marcarNotificacionLeida = (id_notificacion) =>
    apiClient.post(`/notificaciones/${id_notificacion}/leida`);