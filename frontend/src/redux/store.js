import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice';
import themeReducer from './themeSlice'; // Импортируем новую тему

export const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer,
        theme: themeReducer // Добавляем в стор
    }
});