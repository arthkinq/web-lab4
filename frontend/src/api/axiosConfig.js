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

export const setupAxiosInterceptors = (store, { logout, clearLocalPoints }) => {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                store.dispatch(clearLocalPoints());
                store.dispatch(logout());
            }
            return Promise.reject(error);
        }
    );
};

export default api;