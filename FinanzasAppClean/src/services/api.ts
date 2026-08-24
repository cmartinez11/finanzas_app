import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
    baseURL: 'http://167.148.33.239:8080/api', // Apuntando directamente a tu VPS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para inyectar automáticamente el token Bearer
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;