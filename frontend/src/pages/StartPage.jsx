import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import api from '../api/axiosConfig';
import { Container, Paper, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Иконки
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

// Наши новые компоненты
import BackgroundBlobs from '../components/BackgroundBlobs';
import TechShootingStars from '../components/TechShootingStars';
import CustomInput from '../components/CustomInput';
import InfoCard from '../components/InfoCard';
import { useSelector } from 'react-redux'; // Добавь useSelector
import { toggleTheme } from '../redux/themeSlice';
const StartPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [login, setLogin] = useState(localStorage.getItem('remembered_login') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const darkMode = useSelector((state) => state.theme.darkMode);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Тема (можно вынести в отдельный хук, но для одной страницы ок здесь)
    const theme = {
        bg: darkMode ? '#0f172a' : '#f8fafc',
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.75)',
        cardBorder: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
        text: darkMode ? '#f1f5f9' : '#334155',
        subText: darkMode ? '#94a3b8' : '#64748b',
        inputBg: darkMode ? '#1e293b' : '#f1f5f9',
        inputHover: darkMode ? '#334155' : '#e2e8f0',
        iconColor: darkMode ? '#94a3b8' : '#94a3b8'
    };

    const handleAuth = async () => {
        if (!login || !password) { setError('Введите логин и пароль'); return; }
        if (login.length < 5) { setError('Логин минимум 5 символов'); return; }
        if (password.length < 5) { setError('Пароль минимум 5 символов'); return; }

        setError('');
        try {
            if (isRegister) await api.post('/auth/register', { login, password });
            const response = await api.post('/auth/login', { login, password });
            dispatch(loginSuccess({ token: response.data.token, username: login }));
            navigate('/main');
        } catch (err) {
            setError(typeof err.response?.data === 'string' ? err.response.data : 'Ошибка операции');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', bgcolor: theme.bg ,
            transition: 'background-color 0.5s ease'
        }}>
            {/* Background */}
            <BackgroundBlobs darkMode={darkMode} />
            <TechShootingStars />

            {/* Top Right Controls */}
            <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 20, display: 'flex', gap: 1 }}>



                {/* Info Button */}
                <AnimatePresence>
                    {showInfo ? (
                        <InfoCard onClose={() => setShowInfo(false)} theme={theme} />
                    ) : (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                                onClick={() => setShowInfo(true)}
                                sx={{
                                    bgcolor: darkMode ? '#1e293b' : 'white', color: '#6366f1',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', width: 48, height: 48,
                                    '&:hover': { bgcolor: darkMode ? '#334155' : '#f1f5f9' }
                                }}
                            >
                                <InfoOutlinedIcon />
                            </IconButton>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Theme Toggle */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        onClick={() => dispatch(toggleTheme())}
                        sx={{
                            bgcolor: darkMode ? '#1e293b' : 'white',
                            color: darkMode ? '#fbbf24' : '#f59e0b',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: 48, height: 48,
                            '&:hover': { bgcolor: darkMode ? '#334155' : '#f1f5f9' }
                        }}
                    >
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={darkMode ? 'dark' : 'light'}
                                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {darkMode ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                            </motion.div>
                        </AnimatePresence>
                    </IconButton>
                </motion.div>
            </Box>

            {/* Auth Form */}
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
                <Paper
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    elevation={0}
                    sx={{
                        p: 4, borderRadius: '32px',
                        background: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.cardBorder}`,
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden',
                        transition: 'background-color 0.3s ease, border-color 0.3s ease'
                    }}
                >
                    <motion.div layout>
                        <Typography variant="h2" align="center" sx={{
                            fontWeight: 900, letterSpacing: '-2px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                            backgroundClip: 'text', textFillColor: 'transparent', mb: 0
                        }}>
                            WEB4
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ color: theme.subText, fontWeight: 600, mb: 3 }}>
                            Лабораторная работа
                        </Typography>
                    </motion.div>

                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <CustomInput label="Логин" value={login} onChange={(e) => setLogin(e.target.value)} icon={<AccountCircleRoundedIcon />} theme={theme} />

                        <CustomInput
                            label="Пароль" type={showPassword ? 'text' : 'password'}
                            value={password} onChange={(e) => setPassword(e.target.value)} theme={theme}
                            icon={<KeyRoundedIcon />}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: theme.iconColor, '&:hover': { color: '#6366f1' } }}>
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
                                {isRegister ? 'Зарегистрироваться и войти' : 'Войти'}
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