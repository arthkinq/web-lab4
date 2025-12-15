import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setR, setRError } from '../redux/pointsSlice';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
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
    const darkMode = useSelector((state) => state.theme.darkMode);

    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    // Локальное состояние ошибок
    const [localErrors, setLocalErrors] = useState({ y: '', r: '' });

    // Диапазоны по заданию
    const xValues = ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'];
    const rValues = ['-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'];

    // Палитра
    const theme = {
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
        textSecondary: darkMode ? '#94a3b8' : '#64748b',
        btnInactiveBg: darkMode ? '#0f172a' : 'rgba(241, 245, 249, 0.8)',
        btnInactiveText: darkMode ? '#94a3b8' : '#64748b',
        inputBg: darkMode ? '#0f172a' : '#f8fafc',
        inputHover: darkMode ? '#1e293b' : '#f1f5f9',
        iconColor: darkMode ? '#818cf8' : '#6366f1'
    };

    // При изменении R через кнопки
    const handleRChange = (val) => {
        const numVal = Number(val);

        // Валидация R (по заданию приложение должно валидировать некорректные данные)
        if (numVal <= 0) {
            dispatch(setRError('Радиус должен быть положительным'));
            // Мы все равно ставим значение, чтобы UI обновился, но блокируем отправку флагами ошибок
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

        // Валидация Y (-5 ... 5)
        if (!isStrictNumber(y)) {
            newErrors.y = 'Введите число'; isValid = false;
        } else {
            const yVal = parseFloat(y.replace(',', '.'));
            if (yVal < -5 || yVal > 5) { newErrors.y = 'Диапазон: -5 ... 5'; isValid = false; }
        }

        // Валидация R (положительный)
        if (currentR <= 0) {
            dispatch(setRError('R должен быть > 0'));
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

    // Анимация
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
                    Задайте координаты и радиус
                </Typography>
            </motion.div>

            {/* ВЫБОР X (Buttons) */}
            <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AdsClickRoundedIcon fontSize="small" sx={{ color: theme.iconColor }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: theme.textSecondary }}>
                        Координата X
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {xValues.map((v) => {
                        const isSelected = Number(x) === Number(v);
                        return (
                            <motion.button
                                key={v}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setX(Number(v))}
                                style={{
                                    border: 'none', outline: 'none', cursor: 'pointer',
                                    padding: '8px 14px', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: isSelected ? 800 : 600,
                                    background: isSelected ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : theme.btnInactiveBg,
                                    color: isSelected ? 'white' : theme.btnInactiveText,
                                    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {v}
                            </motion.button>
                        );
                    })}
                </Box>
            </motion.div>

            {/* INPUT Y (Text) */}
            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Координата Y" placeholder="-5 ... 5" value={y}
                    onChange={(e) => setY(e.target.value)}
                    error={localErrors.y} icon={<HeightRoundedIcon />}
                    theme={theme}
                />
            </motion.div>

            {/* ВЫБОР R (Buttons) */}
            <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <RadarRoundedIcon fontSize="small" sx={{ color: globalRError ? '#ef4444' : theme.iconColor }} />
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: globalRError ? '#ef4444' : theme.textSecondary }}>
                        Радиус R
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {rValues.map((v) => {
                        const isSelected = Number(currentR) === Number(v);
                        const isInvalid = Number(v) <= 0; // Для визуальной индикации "опасных" кнопок
                        return (
                            <motion.button
                                key={v}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleRChange(v)}
                                style={{
                                    border: 'none', outline: 'none', cursor: 'pointer',
                                    padding: '8px 14px', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: isSelected ? 800 : 600,
                                    // Красный оттенок если выбрано отрицательное
                                    background: isSelected
                                        ? (isInvalid ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'linear-gradient(135deg, #10b981, #34d399)')
                                        : theme.btnInactiveBg,
                                    color: isSelected ? 'white' : theme.btnInactiveText,
                                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {v}
                            </motion.button>
                        );
                    })}
                </Box>
                <AnimatePresence>
                    {globalRError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                            <ErrorOutlineRoundedIcon fontSize="inherit" /> {globalRError}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* КНОПКА ОТПРАВКИ */}
            <motion.div variants={itemVariants}>
                <Button
                    fullWidth variant="contained" size="large" onClick={handleSubmit}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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

// --- Компонент Input (Тот же, что и был, с косметическими правками) ---
const CustomTextField = ({ label, value, onChange, error, placeholder, icon, theme }) => (
    <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, ml: 1 }}>
            {React.cloneElement(icon, { fontSize: 'small', sx: { color: error ? '#ef4444' : theme.iconColor } })}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: error ? '#ef4444' : theme.textSecondary }}>
                {label}
            </Typography>
        </Box>

        <TextField
            fullWidth variant="filled" value={value} onChange={onChange} placeholder={placeholder}
            error={!!error} autoComplete="off"
            InputProps={{
                disableUnderline: true,
                sx: {
                    borderRadius: '16px',
                    bgcolor: error ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2') : theme.inputBg,
                    border: '2px solid',
                    borderColor: error ? '#fecaca' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    color: theme.inputBg === '#0f172a' ? '#f1f5f9' : '#334155',
                    '&:hover': {
                        bgcolor: error ? (theme.inputBg === '#0f172a' ? 'rgba(127, 29, 29, 0.3)' : '#fef2f2') : theme.inputHover
                    },
                    '&.Mui-focused': {
                        bgcolor: theme.inputBg === '#0f172a' ? '#1e293b' : '#fff',
                        borderColor: error ? '#ef4444' : '#8b5cf6',
                    },
                    '& input::placeholder': { color: theme.textSecondary, opacity: 0.7 }
                }
            }}
        />
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0, x: -10 }} animate={{ opacity: 1, height: 'auto', x: 0 }} exit={{ opacity: 0, height: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginLeft: '8px' }}
                >
                    <ErrorOutlineRoundedIcon fontSize="inherit" /> {error}
                </motion.div>
            )}
        </AnimatePresence>
    </Box>
);

export default PointForm;