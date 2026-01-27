
import apiClient from '../services/apiClient';

// Listar rubros
export const getRubros = () => apiClient.get('/microempresas/rubros');
export const getRubrosActivos = () => apiClient.get('/microempresas/rubros/activos');
export const createRubro = (data) => apiClient.post('/microempresas/rubros', data);
export const updateRubro = (id, data) => apiClient.put(`/microempresas/rubros/${id}`, data);
export const toggleEstadoRubro = (id, activo) => apiClient.patch(`/microempresas/rubros/${id}/estado`, activo); // Backend espera bool body, cuidado con axios

// Obtener suscripción por id
export const getSuscripcionById = (id_suscripcion) => apiClient.get(`/suscripciones/${id_suscripcion}`);

export const getMicroempresas = () => apiClient.get('/microempresas/');
export const createMicroempresa = (data) => apiClient.post('/microempresas/', data);
export const getMicroempresaById = (id) => apiClient.get(`/microempresas/${id}`);
export const activarMicroempresa = (id) => apiClient.put(`/microempresas/${id}/activar`);
export const desactivarMicroempresa = (id) => apiClient.put(`/microempresas/${id}/desactivar`);
export const getPlanMicroempresa = (id) => apiClient.get(`/suscripciones/microempresa/${id}/plan`);
export const assignPlan = (data) => apiClient.post('/suscripciones/', data);

export const getMicroempresasPorNombre = () => apiClient.get('/microempresas/orden/nombre');
export const getMicroempresasPorNit = () => apiClient.get('/microempresas/orden/nit');
export const getMicroempresasPorPlan = (id_plan) => apiClient.get(`/microempresas/por-plan/${id_plan}`);
export const getMicroempresasActivas = () => apiClient.get('/microempresas/activas');
export const getMicroempresasInactivas = () => apiClient.get('/microempresas/inactivas');

// Actualizar microempresa
export const updateMicroempresa = (id_microempresa, data) =>
	apiClient.put(`/microempresas/${id_microempresa}`, data);
