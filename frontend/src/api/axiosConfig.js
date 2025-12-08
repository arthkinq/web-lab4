import axios from 'axios';

const API_URL = import.meta.env.DEV
    ? 'http://localhost:8081/weblab4/api'
    : '/weblab4/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;