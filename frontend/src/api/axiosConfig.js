import axios from 'axios';

// Адрес твоего туннеля

const API_URL = import.meta.env.DEV
    ? 'http://localhost:8081/weblab4/api'
    : '/weblab4/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


// Автоматически добавлять токен к каждому запросу, если он есть
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;