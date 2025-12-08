import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('jwt_token');

const initialState = {
    isAuthenticated: !!token,
    token: token,
    username: localStorage.getItem('username') || null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.username = action.payload.username;

            localStorage.setItem('jwt_token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;
            localStorage.clear();
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;