import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setR, setRError } from '../redux/pointsSlice';
import { Paper, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Иконки
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AdsClickRoundedIcon from '@mui/icons-material/AdsClickRounded'; // Для X
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';     // Для Y
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';       // Для R
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const PointForm = () => {
    const dispatch = useDispatch();

    // --- REDUX STATE ---
    const currentR = useSelector((state) => state.points.currentR);
    const globalRError = useSelector((state) => state.points.rError);
    const darkMode = useSelector((state) => state.theme.darkMode);

    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [rLocal, setRLocal] = useState(currentR);
    const [localErrors, setLocalErrors] = useState({ y: '', r: '' });

    // --- ПАЛИТРА ТЕМЫ ---
    const theme = {
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
        textPrimary: darkMode ? '#f1f5f9' : '#334155',
        textSecondary: darkMode ? '#94a3b8' : '#64748b',
        btnInactiveBg: darkMode ? '#0f172a' : 'rgba(241, 245, 249, 0.8)',
        btnInactiveText: darkMode ? '#94a3b8' : '#64748b',
        inputBg: darkMode ? '#0f172a' : '#f8fafc',
        inputHover: darkMode ? '#1e293b' : '#f1f5f9',
        iconColor: darkMode ? '#818cf8' : '#6366f1'
    };

    useEffect(() => {
        setRLocal(currentR);
    }, [currentR]);

    // --- ВАЛИДАЦИЯ И ЛОГИКА ---
    const handleRChange = (val) => {
        const numVal = Number(val);
        // Валидация R сразу при клике
        if (numVal <= 0) {
            dispatch(setRError('R должен быть > 0'));
        } else {
            dispatch(setRError(''));
        }
        dispatch(setR(numVal));
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
            newErrors.y = 'Y должен быть числом'; isValid = false;
        } else {
            const yVal = parseFloat(y.replace(',', '.'));
            if ( yVal > 5 || yVal < -5) { newErrors.y = 'Y должен быть от -5 до 5'; isValid = false; }

        }

        if (currentR <= 0) {
            dispatch(setRError('R должен быть больше 0'));
            isValid = false;
        }

        setLocalErrors(newErrors);

        if (isValid) {
            dispatch(addPoint({
                x,
                y: parseFloat(y.replace(',', '.')),
                r: currentR
            }));
        }
    };

    const xValues = ['-2','-1.5','-1','-0.5','0','0.5','1','1.5'];
    // Добавим значения для R кнопок, раз уж мы делаем интерфейс консистентным
    const rValues = ['-4','-3','-2','-1','0','1', '2', '3', '4'];

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
                background: theme.cardBg,
                backdropFilter: 'blur(12px)',
                border: theme.border,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                maxWidth: '100%', overflow: 'hidden',
                transition: 'background 0.3s, border 0.3s'
            }}
        >
            <motion.div variants={itemVariants}>
                <Typography variant="h5" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    backgroundClip: 'text', textFillColor: 'transparent', mb: 0.5
                }}>
                    Параметры
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textSecondary, fontWeight: 500 }}>
                    Задайте координаты точки
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
                                    // ИСПРАВЛЕНИЕ: Фиксированная ширина и высота
                                    width: '54px',
                                    height: '42px',
                                    padding: 0, // Убираем паддинг, центрируем через Flex
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',

                                    borderRadius: '14px',
                                    fontSize: '0.9rem', fontWeight: isSelected ? 800 : 600,
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

            {/* INPUT Y */}
            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Ось Y" placeholder="-5 ... 5" value={y}
                    onChange={(e) => setY(e.target.value)}
                    error={localErrors.y} icon={<HeightRoundedIcon />}
                    theme={theme}
                />
            </motion.div>

            {/* ВЫБОР R (КНОПКИ ВМЕСТО INPUT для красоты, или оставь инпут, если так нужно по заданию) */}
            {/* Если по заданию нужен именно Input для R, то оставь CustomTextField ниже.
                Но раз мы делали слайдер на графике, логично сделать кнопки и здесь.
                Ниже пример кнопок для R. */}

            <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <RadarRoundedIcon fontSize="small" sx={{ color: globalRError ? '#ef4444' : theme.iconColor }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: globalRError ? '#ef4444' : theme.textSecondary }}>
                        Радиус R
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {rValues.map((v) => {
                        const isSelected = Number(currentR) === Number(v);
                        return (
                            <motion.button
                                key={v}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleRChange(v)}
                                style={{
                                    border: 'none', outline: 'none', cursor: 'pointer',
                                    // ИСПРАВЛЕНИЕ: Фиксированная ширина и высота
                                    width: '54px',
                                    height: '42px',
                                    padding: 0,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',

                                    borderRadius: '14px',
                                    fontSize: '0.9rem', fontWeight: isSelected ? 800 : 600,
                                    // Цвет зависит от валидности R (если вдруг придет 0)
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

                {/* Сообщение об ошибке R */}
                <AnimatePresence>
                    {globalRError && (
                        <motion.div
                            initial={{ opacity: 0, y: -5, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -5, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                mt: 1, p: 1, px: 1.5,
                                borderRadius: '12px',
                                // Тот же стиль, что и в инпутах
                                bgcolor: theme.inputBg === '#0f172a' ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid',
                                borderColor: theme.inputBg === '#0f172a' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                            }}>
                                <ErrorOutlineRoundedIcon fontSize="small" />
                                <Typography variant="caption" fontWeight={700}>
                                    {globalRError}
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
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

// --- CustomTextField Component ---
const CustomTextField = ({ label, value, onChange, error, placeholder, icon, theme }) => (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Метка с иконкой */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            {React.cloneElement(icon, { fontSize: 'small', sx: { color: error ? '#ef4444' : theme.iconColor, transition: 'color 0.3s' } })}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: error ? '#ef4444' : theme.textSecondary, transition: 'color 0.3s' }}>
                {label}
            </Typography>
        </Box>

        <TextField
            fullWidth
            variant="filled"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={!!error}
            autoComplete="off"
            // Отключаем стандартный helperText, так как делаем свой
            helperText={null}
            InputProps={{
                disableUnderline: true,
                sx: {
                    borderRadius: '16px',
                    // Фон меняется при ошибке
                    bgcolor: error
                        ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.15)' : '#fff1f2')
                        : theme.inputBg,
                    border: '2px solid',
                    borderColor: error ? '#fecaca' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    color: theme.textPrimary,
                    '&:hover': {
                        bgcolor: error
                            ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.25)' : '#ffe4e6')
                            : theme.inputHover
                    },
                    '&.Mui-focused': {
                        bgcolor: theme.inputBg === '#0f172a' ? '#1e293b' : '#fff',
                        borderColor: error ? '#ef4444' : '#8b5cf6',
                        boxShadow: error
                            ? '0 0 0 4px rgba(239, 68, 68, 0.15)'
                            : '0 0 0 4px rgba(139, 92, 246, 0.15)'
                    },
                    '& input::placeholder': { color: theme.textSecondary, opacity: 0.7 }
                }
            }}
        />

        {/* --- КАСТОМНЫЙ БЛОК ОШИБКИ --- */}
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }} // Важно для анимации высоты
                >
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        mt: 0.5, p: 1, px: 1.5,
                        borderRadius: '12px',
                        // Стиль "Error Bubble"
                        bgcolor: theme.inputBg === '#0f172a' ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                        color: '#ef4444',
                        border: '1px solid',
                        borderColor: theme.inputBg === '#0f172a' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                    }}>
                        <ErrorOutlineRoundedIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={700}>
                            {error}
                        </Typography>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    </Box>
);

export default PointForm;