import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de petición para agregar token si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejo de errores comunes
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Errores de respuesta del servidor
      switch (error.response.status) {
        case 401:
          // No autorizado
          // Aquí podrías redirigir al login o limpiar el estado
          break;
        case 403:
          // Prohibido
          break;
        case 404:
          // No encontrado
          break;
        case 500:
          // Error interno del servidor
          break;
        default:
          break;
      }
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error('No response from server:', error.request);
    } else {
      // Error al configurar la petición
      console.error('Error setting up request:', error.message);
    }
    // Siempre rechaza la promesa para que el componente lo maneje
    return Promise.reject(error);
  }
);

export default apiClient;
