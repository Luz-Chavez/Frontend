import apiClient from '../services/apiClient';

export const getTotalMicroempresas = () => apiClient.get('/microempresas/total');
export const getTotalMicroempresasActivas = () => apiClient.get('/microempresas/total/activas');
export const getTotalMicroempresasInactivas = () => apiClient.get('/microempresas/total/inactivas');
export const getTotalPlanesActivos = () => apiClient.get('/planes/total/activos');
