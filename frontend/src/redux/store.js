import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer,
        theme: themeReducer
    }
});