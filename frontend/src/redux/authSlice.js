import { createSlice } from '@reduxjs/toolkit';

// Пытаемся достать токен из localStorage при запуске
const token = localStorage.getItem('jwt_token');
const username = localStorage.getItem('username');

const initialState = {
    isAuthenticated: !!token,
    token: token,
    username: username || null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.username = action.payload.username;

            // Сохраняем сессию
            localStorage.setItem('jwt_token', action.payload.token);
            localStorage.setItem('username', action.payload.username);

            // ВАЖНО: Сохраняем логин "на память" (этот ключ мы не будем удалять при выходе)
            localStorage.setItem('remembered_login', action.payload.username);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;

            // Удаляем ТОЛЬКО данные текущей сессии
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('username');

            // ВАЖНО: Мы НЕ делаем localStorage.clear(),
            // чтобы сохранить 'theme' и 'remembered_login'
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;