import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper, IconButton, Avatar, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Redux
import { fetchPoints, clearLocalPoints } from '../redux/pointsSlice';
import { logout } from '../redux/authSlice';

// Компоненты
import Graph from '../components/Graph';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';
import BackgroundBlobs from '../components/BackgroundBlobs'; // Импортируем фон

// Иконки
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { toggleTheme } from '../redux/themeSlice'; // Импорт

const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector((state) => state.auth.username);

    // Локальное состояние темы (в идеале вынести в Context/Redux, но пока так)
    const darkMode = useSelector((state) => state.theme.darkMode);
    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearLocalPoints());
        navigate('/');
    };

    // Цветовая палитра
    const theme = {
        bg: darkMode ? '#0f172a' : '#f8fafc',
        glass: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        text: darkMode ? '#f1f5f9' : '#334155',
        subText: darkMode ? '#94a3b8' : '#64748b',
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: theme.bg,
            position: 'relative',
            overflowX: 'hidden', // Глобально убираем гориз. скролл
            transition: 'background-color 0.5s ease'
        }}>

            {/* 1. Живой фон */}
            <BackgroundBlobs darkMode={darkMode} />

            {/* 2. Контент с анимацией появления */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ position: 'relative', zIndex: 10, paddingBottom: '40px' }}
            >
                {/* --- HEADER (Floating Glass Navbar) --- */}
                <Box sx={{ p: 2, maxWidth: '1600px', margin: '0 auto' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2, px: 3,
                            borderRadius: '24px',
                            // Glassmorphism
                            background: theme.glass,
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                    >
                        {/* Логотип */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                p: 1, borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                color: 'white', display: 'flex', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}>
                                <DashboardRoundedIcon />
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 800, letterSpacing: '-0.5px',
                                background: 'linear-gradient(to right, #6366f1, #ec4899)',
                                backgroundClip: 'text', textFillColor: 'transparent',
                                display: { xs: 'none', sm: 'block' }
                            }}>
                                WEB 4 LAB
                            </Typography>
                        </Box>

                        {/* Правая часть: Юзер, Тема, Выход */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                            {/* Инфо о юзере */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '20px', bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: 'transparent', color: theme.text }}>
                                    <AccountCircleRoundedIcon />
                                </Avatar>
                                <Typography variant="subtitle2" fontWeight={600} color={theme.text}>
                                    {username || 'Guest'}
                                </Typography>
                            </Box>

                            {/* Переключатель темы */}
                            <Tooltip title="Сменить тему">
                                <IconButton onClick={() => dispatch(toggleTheme())}  sx={{ color: theme.subText }}>
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            key={darkMode ? 'dark' : 'light'}
                                            initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
                                        >
                                            {darkMode ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                                        </motion.div>
                                    </AnimatePresence>
                                </IconButton>
                            </Tooltip>

                            {/* Выход */}
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                                startIcon={<LogoutRoundedIcon />}
                                sx={{
                                    borderRadius: '14px', fontWeight: 700, textTransform: 'none',
                                    bgcolor: '#fee2e2', color: '#ef4444', boxShadow: 'none',
                                    '&:hover': { bgcolor: '#fecaca', boxShadow: 'none' }
                                }}
                            >
                                Выйти
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {/* --- GRID LAYOUT (Responsive Dashboard) --- */}
                <Box sx={{
                    display: 'grid',
                    gap: '24px', // Чуть больше воздуха между блоками
                    padding: '0 24px',
                    margin: '0 auto',
                    width: '100%',
                    maxWidth: '1600px',
                    boxSizing: 'border-box',
                    alignItems: 'start',

                    // Mobile
                    gridTemplateColumns: 'minmax(0, 1fr)',
                    gridTemplateAreas: `
                        "form"
                        "graph"
                        "table"
                    `,
                    justifyItems: 'center',

                    // Tablet
                    '@media (min-width: 827px)': {
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateAreas: `
                            "form graph"
                            "table table"
                        `,
                        justifyItems: 'stretch',
                    },

                    // Desktop
                    '@media (min-width: 1225px)': {
                        gridTemplateColumns: 'auto 420px 1fr', // Форма чуть шире для красоты
                        gridTemplateAreas: `
                            "graph form table"
                        `,
                        justifyItems: 'start',
                    }
                }}>

                    {/* GRAPH */}
                    <Box sx={{
                        gridArea: 'graph',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        // На десктопе прижимаем влево, но с отступом, чтобы центрировать визуально
                        '@media (min-width: 1225px)': { justifyContent: 'flex-start' }
                    }}>
                        <Graph />
                    </Box>

                    {/* FORM */}
                    <Box sx={{
                        gridArea: 'form',
                        width: '100%',
                        maxWidth: '500px',
                        // Небольшая анимация появления с задержкой
                        animation: 'fadeInUp 0.6s ease-out 0.2s backwards',
                        '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                    }}>
                        <PointForm />
                    </Box>

                    {/* TABLE */}
                    <Box sx={{
                        gridArea: 'table',
                        width: '100%',
                        height: '100%',
                        minHeight: '500px', // Чтобы таблица не схлопывалась
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.6s ease-out 0.4s backwards',
                    }}>
                        <ResultsTable />
                    </Box>

                </Box>
            </motion.div>
        </Box>
    );
};

export default MainPage;