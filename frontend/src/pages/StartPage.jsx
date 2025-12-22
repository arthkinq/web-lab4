import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import api from '../api/axiosConfig';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box,
    IconButton,
    InputAdornment,
    CssBaseline,
    Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SchoolIcon from '@mui/icons-material/School';

import BackgroundBlobs from '../components/BackgroundBlobs';
import CustomInput from '../components/CustomInput';
import ThemeToggle from "../components/ThemeToggle.jsx";

const StartPage = () => {

    const [isRegister, setIsRegister] = useState(false);
    const [login, setLogin] = useState(localStorage.getItem('remembered_login') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        document.title = "Вход | Web Lab 4";
    }, []);
    const passwordInputRef = useRef(null);

    const darkMode = useSelector((state) => state.theme.darkMode);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = {
        bg: darkMode ? '#0f172a' : '#f8fafc',
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        cardBorder: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
        text: darkMode ? '#f1f5f9' : '#334155',
        subText: darkMode ? '#94a3b8' : '#64748b',
        inputBg: darkMode ? '#1e293b' : '#f1f5f9',
        inputHover: darkMode ? '#334155' : '#e2e8f0',
        iconColor: darkMode ? '#94a3b8' : '#94a3b8',
        headerText: darkMode ? '#e2e8f0' : '#475569'
    };

    const handleAuth = async () => {
        if (!login || !password) { setError('Введите логин и пароль'); return; }
        if (login.length < 5) { setError('Логин минимум 5 символов'); return; }
        if (password.length < 5) { setError('Пароль минимум 5 символов'); return; }

        setError('');
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const response = await api.post(endpoint, { login, password });
            dispatch(loginSuccess({ token: response.data.token, username: login }));
            navigate('/main');
        } catch (err) {
            const msg = err.response?.data;
            setError(typeof msg === 'string' ? msg : 'Ошибка операции');
        }
    };

    const handleLoginKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (passwordInputRef.current) passwordInputRef.current.focus();
        }
    };

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAuth();
        }
    };

    return (
        <Box sx={{
            height: '100dvh', width: '100vw',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflowY: 'auto', overflowX: 'hidden',
            bgcolor: theme.bg, transition: 'background-color 0.5s ease', p: 2, boxSizing: 'border-box'
        }}>
            <CssBaseline />
            <BackgroundBlobs darkMode={darkMode} />

            <Box sx={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                zIndex: 30
            }}>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: 0.5,
                    p: 2, borderRadius: '20px',
                    bgcolor: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: theme.headerText }}>
                        Сланов Артур
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, color: theme.subText }}>
                        <Typography variant="caption" fontWeight={600} display="flex" alignItems="center" gap={0.5}>
                            <SchoolIcon fontSize="inherit" /> P3222
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                            Вар. 74923
                        </Typography>
                    </Box>
                </Box>

                <ThemeToggle />
            </Box>

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
                <Paper
                    component={motion.div} layout
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    elevation={0}
                    sx={{
                        p: 4, borderRadius: '32px',
                        background: theme.cardBg, backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        display: 'flex', flexDirection: 'column', gap: 2
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                            backgroundClip: 'text', textFillColor: 'transparent'
                        }}>
                            Web Lab 4
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.subText, fontWeight: 600 }}>
                            Авторизация
                        </Typography>
                    </Box>

                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <CustomInput
                            label="Логин" value={login} onChange={(e) => setLogin(e.target.value)}
                            onKeyDown={handleLoginKeyDown} icon={<AccountCircleRoundedIcon />} theme={theme} size="small"
                        />
                        <CustomInput
                            label="Пароль" type={showPassword ? 'text' : 'password'}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handlePasswordKeyDown} theme={theme} icon={<KeyRoundedIcon />}
                            inputRef={passwordInputRef} size="small"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" tabIndex={-1} sx={{ color: theme.iconColor }}>
                                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <Typography color="error" align="center" variant="caption" sx={{ display: 'block', fontWeight: 700 }}>{error}</Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div layout whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                fullWidth variant="contained" size="large" onClick={handleAuth}
                                sx={{
                                    py: 1.5, borderRadius: '16px', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
                                    background: isRegister ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                                }}
                                startIcon={isRegister ? <PersonAddRoundedIcon /> : <LoginRoundedIcon />}
                            >
                                {isRegister ? 'Зарегестрироваться' : 'Войти'}
                            </Button>
                        </motion.div>
                    </Box>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: theme.subText }}>{isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}</Typography>
                        <Button size="small" onClick={() => { setIsRegister(!isRegister); setError(''); }} sx={{ textTransform: 'none', fontWeight: 700, color: isRegister ? '#ec4899' : '#6366f1' }}>
                            {isRegister ? "Войти" : "Создать"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default StartPage;