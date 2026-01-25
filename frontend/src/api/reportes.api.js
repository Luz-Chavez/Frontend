import axios from './axios';

export const getDashboardData = (idMicro, periodo) => 
    axios.get(`/reportes/dashboard?id_microempresa=${idMicro}&periodo=${periodo}`);