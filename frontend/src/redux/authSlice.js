import { createSlice } from '@reduxjs/toolkit';

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

            localStorage.setItem('jwt_token', action.payload.token);
            localStorage.setItem('username', action.payload.username);

            localStorage.setItem('remembered_login', action.payload.username);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;

            localStorage.removeItem('jwt_token');
            localStorage.removeItem('username');


        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;