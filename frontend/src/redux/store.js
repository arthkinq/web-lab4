import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice'; // Импорт

export const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer // Добавили
    }
});