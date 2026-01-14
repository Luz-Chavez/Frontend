import axios from './axios';

// Función para registrar usuario (Módulo 1)
export const registerRequest = (user) => axios.post(`/auth/register`, user);

// Función para iniciar sesión (Módulo 1)
export const loginRequest = (user) => axios.post(`/auth/login`, user);

// Función para verificar si el usuario sigue logueado (verificar token)
export const verifyTokenRequest = () => axios.get(`/auth/verify`);