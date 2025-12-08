import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, Typography } from '@mui/material';

// Импорт Redux экшенов
import { fetchPoints, clearLocalPoints } from '../redux/pointsSlice';
import { logout } from '../redux/authSlice';

// Импорт компонентов
import Graph from '../components/Graph';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';

const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Загрузка точек при монтировании компонента
    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    // Обработчик выхода
    const handleLogout = () => {
        dispatch(logout());           // Сброс токена авторизации
        dispatch(clearLocalPoints()); // Очистка таблицы в Redux
        navigate('/');                // Редирект на страницу входа
    };

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            {/* Верхняя панель (Header) */}
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Web Lab 4
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        ВЫХОД
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Основной контейнер сетки (CSS Grid) */}
            <Box sx={{
                display: 'grid',
                gap: '20px',
                padding: '16px', // Отступы от краев экрана
                margin: '0 auto',
                width: '100%',
                maxWidth: '1600px',
                boxSizing: 'border-box', // Важно, чтобы padding не расширял ширину
                alignItems: 'start',     // Элементы прижимаются к верху ячейки

                // --- 1. МОБИЛЬНЫЙ РЕЖИМ (< 827px) ---
                // Одна колонка, всё центрировано
                gridTemplateColumns: 'minmax(0, 1fr)', // minmax предотвращает вылезание контента
                gridTemplateAreas: `
                    "graph"
                    "form"
                    "table"
                `,
                justifyItems: 'center',

                // --- 2. ПЛАНШЕТНЫЙ РЕЖИМ (>= 827px) ---
                // Две колонки, элементы растягиваются
                '@media (min-width: 827px)': {
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateAreas: `
                        "graph form"
                        "table table"
                    `,
                    justifyItems: 'stretch', // Исправление "кривого" вида: блоки занимают всю ширину ячейки
                },

                // --- 3. ДЕСКТОПНЫЙ РЕЖИМ (>= 1225px) ---
                // Три колонки в ряд: График | Форма | Таблица
                '@media (min-width: 1225px)': {
                    // auto (по размеру графика) | 400px (фикс формы) | 1fr (остаток таблице)
                    gridTemplateColumns: 'auto 400px 1fr',
                    gridTemplateAreas: `
                        "graph form table"
                    `,
                    justifyItems: 'start', // На десктопе прижимаем к началу
                }
            }}>

                {/* Область ГРАФИКА */}
                <Box sx={{
                    gridArea: 'graph',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    // На десктопе убираем лишнее центрирование, чтобы прижать влево
                    '@media (min-width: 1225px)': { justifyContent: 'flex-start' }
                }}>
                    <Graph />
                </Box>

                {/* Область ФОРМЫ */}
                <Box sx={{
                    gridArea: 'form',
                    width: '100%',
                    maxWidth: '500px' // Ограничиваем ширину на мобильных, чтобы не было слишком широко
                }}>
                    <PointForm />
                </Box>

                {/* Область ТАБЛИЦЫ */}
                <Box sx={{
                    gridArea: 'table',
                    width: '100%',
                    overflowX: 'hidden' // Скрываем горизонтальный скролл таблицы, если она переполняется
                }}>
                    <ResultsTable />
                </Box>

            </Box>
        </Box>
    );
};

export default MainPage;