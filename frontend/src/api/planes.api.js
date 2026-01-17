import apiClient from '../services/apiClient';

export const getPlanes = () => apiClient.get('/planes/');
export const getPlanById = (id) => apiClient.get(`/planes/${id}`);
export const createPlan = (data) => apiClient.post('/planes/', data);
export const updatePlan = (id, data) => apiClient.put(`/planes/${id}`, data);
export const deletePlan = (id) => apiClient.delete(`/planes/${id}`);
export const activarPlan = (id) => apiClient.put(`/planes/${id}/activar`);
export const desactivarPlan = (id) => apiClient.put(`/planes/${id}/desactivar`);

export const getPlanesActivos = () => apiClient.get('/planes/activos');
export const getPlanesNoActivos = () => apiClient.get('/planes/no-activos');
