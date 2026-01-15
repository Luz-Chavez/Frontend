import apiClient from '../services/apiClient';

// Función para registrar usuario (Módulo 1)
export const registerRequest = (user) => apiClient.post('/usuarios/', user);

// Función para iniciar sesión (Módulo 1)
export const loginRequest = (user) => {
	const params = new URLSearchParams();
	params.append('username', user.email); // FastAPI espera 'username'
	params.append('password', user.password);
	return apiClient.post('/login', params, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
};

// Función para verificar si el usuario sigue logueado (verificar token)
export const verifyTokenRequest = () => apiClient.get('/auth/verify');