import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setR, setRError } from '../redux/pointsSlice';
import { Paper, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Иконки
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AdsClickRoundedIcon from '@mui/icons-material/AdsClickRounded';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const PointForm = () => {
    const dispatch = useDispatch();

    // --- REDUX STATE ---
    const currentR = useSelector((state) => state.points.currentR);
    const globalRError = useSelector((state) => state.points.rError);
    // Получаем глобальную тему
    const darkMode = useSelector((state) => state.theme.darkMode);

    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [rLocal, setRLocal] = useState(currentR);
    const [localErrors, setLocalErrors] = useState({ y: '', r: '' });

    // --- ПАЛИТРА ТЕМЫ (Адаптируем под Dark/Light) ---
    const theme = {
        // Фон карточки: Светлый полупрозрачный или Темный полупрозрачный (Slate-800)
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        // Граница: Тонкая белая для темной темы, чтобы выделить стекло
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
        // Текст
        textPrimary: darkMode ? '#f1f5f9' : '#334155',
        textSecondary: darkMode ? '#94a3b8' : '#64748b',
        // Кнопки X (неактивные)
        btnInactiveBg: darkMode ? '#0f172a' : 'rgba(241, 245, 249, 0.8)',
        btnInactiveText: darkMode ? '#94a3b8' : '#64748b',
        // Инпуты
        inputBg: darkMode ? '#0f172a' : '#f8fafc',
        inputHover: darkMode ? '#1e293b' : '#f1f5f9',
        // Акцент (оставляем Vivid в обоих темах, но можно подкрутить)
        iconColor: darkMode ? '#818cf8' : '#6366f1'
    };

    useEffect(() => {
        setRLocal(currentR);
    }, [currentR]);

    // --- ВАЛИДАЦИЯ И ЛОГИКА ---
    const handleRChange = (e) => {
        const val = e.target.value;
        setRLocal(val);
        if (globalRError) dispatch(setRError(''));
        setLocalErrors(prev => ({ ...prev, r: '' }));
        if (isStrictNumber(val)) dispatch(setR(parseFloat(val.replace(',', '.'))));
    };

    const isStrictNumber = (str) => {
        const cleanStr = String(str).trim().replace(',', '.');
        return /^-?\d+(\.\d+)?$/.test(cleanStr);
    };

    const handleSubmit = () => {
        let newErrors = { y: '', r: '' };
        let isValid = true;
        dispatch(setRError(''));

        if (!isStrictNumber(y)) {
            newErrors.y = 'Число'; isValid = false;
        } else {
            const yVal = parseFloat(y.replace(',', '.'));
            if (yVal < -3 || yVal > 3) { newErrors.y = '-3 ... 3'; isValid = false; }
        }

        if (!isStrictNumber(rLocal)) {
            newErrors.r = 'Число'; isValid = false;
        } else {
            const rVal = parseFloat(String(rLocal).replace(',', '.'));
            if (rVal < 1 || rVal > 4) { newErrors.r = '1 ... 4'; isValid = false; }
        }

        setLocalErrors(newErrors);

        if (isValid) {
            dispatch(addPoint({
                x,
                y: parseFloat(y.replace(',', '.')),
                r: parseFloat(String(rLocal).replace(',', '.'))
            }));
        }
    };

    const xValues = ['-2','-1.5','-1','-0.5','0','0.5','1','1.5'];

    // --- АНИМАЦИЯ ---
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5, type: 'spring' } }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <Paper
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            elevation={0}
            sx={{
                p: 3, display: 'flex', flexDirection: 'column', gap: 3, borderRadius: '28px',
                // ПРИМЕНЯЕМ ТЕМУ
                background: theme.cardBg,
                backdropFilter: 'blur(12px)',
                border: theme.border,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Тень чуть темнее для универсальности
                maxWidth: '100%', overflow: 'hidden',
                transition: 'background 0.3s, border 0.3s' // Плавный переход темы
            }}
        >
            {/* ЗАГОЛОВОК */}
            <motion.div variants={itemVariants}>
                <Typography variant="h5" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    backgroundClip: 'text', textFillColor: 'transparent', mb: 0.5
                }}>
                    Параметры
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textSecondary, fontWeight: 500 }}>
                    Введите координаты точки
                </Typography>
            </motion.div>

            {/* ВЫБОР X */}
            <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AdsClickRoundedIcon fontSize="small" sx={{ color: theme.iconColor }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: theme.textSecondary }}>
                        Ось X
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {xValues.map((v) => {
                        const isSelected = Number(x) === Number(v);
                        return (
                            <motion.button
                                key={v}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setX(Number(v))}
                                style={{
                                    border: 'none', outline: 'none', cursor: 'pointer',
                                    padding: '10px 16px', borderRadius: '14px',
                                    fontSize: '0.9rem', fontWeight: isSelected ? 800 : 600,
                                    // Динамические цвета кнопок
                                    background: isSelected
                                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                        : theme.btnInactiveBg,
                                    color: isSelected ? 'white' : theme.btnInactiveText,
                                    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                    transition: 'background 0.3s, color 0.3s'
                                }}
                            >
                                {v}
                            </motion.button>
                        );
                    })}
                </Box>
            </motion.div>

            {/* INPUTS - Передаем theme в пропсы */}
            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Ось Y" placeholder="-3 ... 3" value={y}
                    onChange={(e) => setY(e.target.value)}
                    error={localErrors.y} icon={<HeightRoundedIcon />}
                    theme={theme} // Передаем тему
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Радиус R" placeholder="1 ... 4" value={rLocal}
                    onChange={handleRChange}
                    error={localErrors.r || globalRError} icon={<RadarRoundedIcon />}
                    theme={theme} // Передаем тему
                />
            </motion.div>

            {/* КНОПКА */}
            <motion.div variants={itemVariants}>
                <Button
                    fullWidth variant="contained" size="large" onClick={handleSubmit}
                    component={motion.button}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    startIcon={<SendRoundedIcon />}
                    sx={{
                        mt: 1, py: 1.5, borderRadius: '18px',
                        fontSize: '1rem', fontWeight: 800, textTransform: 'none',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                    }}
                >
                    Проверить
                </Button>
            </motion.div>
        </Paper>
    );
};

// --- ОБНОВЛЕННЫЙ CustomTextField ---
const CustomTextField = ({ label, value, onChange, error, placeholder, icon, theme }) => (
    <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, ml: 1 }}>
            {/* Иконка меняет цвет по теме или ошибке */}
            {React.cloneElement(icon, { fontSize: 'small', sx: { color: error ? '#ef4444' : theme.iconColor } })}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: error ? '#ef4444' : theme.textSecondary }}>
                {label}
            </Typography>
        </Box>

        <TextField
            fullWidth variant="filled" value={value} onChange={onChange} placeholder={placeholder}
            error={!!error} autoComplete="off"
            helperText={
                <AnimatePresence>
                    {error && (
                        <motion.span
                            initial={{ opacity: 0, height: 0, x: -10 }} animate={{ opacity: 1, height: 'auto', x: 0 }} exit={{ opacity: 0, height: 0 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                        >
                            <ErrorOutlineRoundedIcon fontSize="inherit" /> {error}
                        </motion.span>
                    )}
                </AnimatePresence>
            }
            InputProps={{
                disableUnderline: true,
                sx: {
                    borderRadius: '16px',
                    // Фон меняется от темы. При ошибке - красный (тусклый красный в темной теме)
                    bgcolor: error ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2') : theme.inputBg,
                    border: '2px solid',
                    borderColor: error ? '#fecaca' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    color: theme.textPrimary, // Текст ввода

                    '&:hover': {
                        bgcolor: error ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.3)' : '#fef2f2') : theme.inputHover
                    },
                    '&.Mui-focused': {
                        bgcolor: theme.inputBg === '#0f172a' ? '#1e293b' : '#fff',
                        borderColor: error ? '#ef4444' : '#8b5cf6',
                        boxShadow: error ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : '0 0 0 4px rgba(139, 92, 246, 0.1)'
                    },
                    // Цвет плейсхолдера
                    '& input::placeholder': {
                        color: theme.textSecondary,
                        opacity: 0.7
                    }
                }
            }}
        />
    </Box>
);

export default PointForm;