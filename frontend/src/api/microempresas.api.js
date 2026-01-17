// Obtener suscripción por id
export const getSuscripcionById = (id_suscripcion) => apiClient.get(`/suscripciones/${id_suscripcion}`);
import apiClient from '../services/apiClient';


export const getMicroempresas = () => apiClient.get('/microempresas/');
export const getMicroempresaById = (id) => apiClient.get(`/microempresas/${id}`);
export const activarMicroempresa = (id) => apiClient.put(`/microempresas/${id}/activar`);
export const desactivarMicroempresa = (id) => apiClient.put(`/microempresas/${id}/desactivar`);
export const getPlanMicroempresa = (id) => apiClient.get(`/suscripciones/microempresa/${id}/plan`);

export const getMicroempresasPorNombre = () => apiClient.get('/microempresas/orden/nombre');
export const getMicroempresasPorNit = () => apiClient.get('/microempresas/orden/nit');
export const getMicroempresasPorPlan = (id_plan) => apiClient.get(`/microempresas/por-plan/${id_plan}`);
export const getMicroempresasActivas = () => apiClient.get('/microempresas/activas');
export const getMicroempresasInactivas = () => apiClient.get('/microempresas/inactivas');
