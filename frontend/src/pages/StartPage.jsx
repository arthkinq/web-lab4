import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import api from '../api/axiosConfig';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

const StartPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = async (isRegister) => {
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const response = await api.post(endpoint, { login, password });

            if (isRegister) {
                setError('Регистрация успешна! Теперь войдите.');
            } else {
                // Если это вход - сохраняем токен и идем на главную
                dispatch(loginSuccess({ token: response.data.token, username: login }));
                navigate('/main');
            }
        } catch (err) {
            setError(err.response?.data || 'Ошибка соединения');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Лабораторная №4
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                    Сланов Артур | P3222 | 74899
                </Typography>

                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <Typography color="error" align="center">{error}</Typography>}

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" fullWidth onClick={() => handleAuth(false)}>
                        Войти
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => handleAuth(true)}>
                        Регистрация
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default StartPage;