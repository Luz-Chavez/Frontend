import axios from 'axios';

// Creamos una instancia básica
const instance = axios.create({
    // IMPORTANTE: Esta URL debe coincidir con la de FastAPI de tus compañeros
    baseURL: 'http://localhost:8000', 
    withCredentials: true // Permite envío de cookies si las usan
});

export default instance;