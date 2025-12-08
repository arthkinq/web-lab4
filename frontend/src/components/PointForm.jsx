import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setR, setRError } from '../redux/pointsSlice';
import { Paper, Typography, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Иконки
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AdsClickRoundedIcon from '@mui/icons-material/AdsClickRounded'; // Для X
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';     // Для Y
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';       // Для R
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const PointForm = () => {
    const dispatch = useDispatch();
    const currentR = useSelector((state) => state.points.currentR);
    const globalRError = useSelector((state) => state.points.rError);

    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [rLocal, setRLocal] = useState(currentR);
    const [localErrors, setLocalErrors] = useState({ y: '', r: '' });

    // Синхронизация R с Redux
    useEffect(() => {
        setRLocal(currentR);
    }, [currentR]);

    // --- ЛОГИКА (Осталась прежней) ---
    const handleRChange = (e) => {
        const val = e.target.value;
        setRLocal(val);

        if (globalRError) dispatch(setRError(''));
        setLocalErrors(prev => ({ ...prev, r: '' }));

        const numVal = parseFloat(val.replace(',', '.'));
        if (!isNaN(numVal)) {
            dispatch(setR(numVal));
        }
    };

    const handleSubmit = () => {
        let newErrors = { y: '', r: '' };
        let isValid = true;

        dispatch(setRError(''));

        const yVal = parseFloat(y.replace(',', '.'));
        if (isNaN(yVal) || yVal < -3 || yVal > 3) {
            newErrors.y = 'от -3 до 3'; // Сократил текст для красоты
            isValid = false;
        }

        const rVal = parseFloat(String(rLocal).replace(',', '.'));
        if (isNaN(rVal) || rVal < 1 || rVal > 4) {
            newErrors.r = 'от 1 до 4';
            isValid = false;
        }

        setLocalErrors(newErrors);

        if (isValid) {
            dispatch(addPoint({ x, y: yVal, r: rVal }));
        }
    };

    const xValues = ['-1.5','-1','-0.5','0','0.5','1','1.5'];

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { staggerChildren: 0.1, duration: 0.5 }
        }
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
            elevation={0} // Убираем стандартную тень, делаем свою
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                borderRadius: '28px',
                // Glassmorphism Style
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                maxWidth: '100%',
                overflow: 'hidden'
            }}
        >
            {/* ЗАГОЛОВОК */}
            <motion.div variants={itemVariants}>
                <Typography variant="h5" sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 1
                }}>
                    Параметры
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Задайте координаты для проверки
                </Typography>
            </motion.div>

            {/* ВЫБОР X (Пузырьки) */}
            <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AdsClickRoundedIcon fontSize="small" sx={{ color: '#6366f1' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="textSecondary">Ось X</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {xValues.map((v) => {
                        const isSelected = String(x) === v;
                        return (
                            <motion.button
                                key={v}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setX(Number(v))}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.9rem',
                                    fontWeight: isSelected ? 700 : 500,
                                    // Цвета: Активный - Градиент, Неактивный - Светлый
                                    background: isSelected
                                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                        : 'rgba(241, 245, 249, 0.8)',
                                    color: isSelected ? 'white' : '#64748b',
                                    boxShadow: isSelected
                                        ? '0 4px 12px rgba(99, 102, 241, 0.4)'
                                        : 'none',
                                    transition: 'background 0.3s, color 0.3s'
                                }}
                            >
                                {v}
                            </motion.button>
                        );
                    })}
                </Box>
            </motion.div>

            {/* ВВОД Y */}
            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Ось Y"
                    placeholder="-3 ... 3"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    error={localErrors.y}
                    icon={<HeightRoundedIcon />}
                />
            </motion.div>

            {/* ВВОД R */}
            <motion.div variants={itemVariants}>
                <CustomTextField
                    label="Радиус R"
                    placeholder="1 ... 4"
                    value={rLocal}
                    onChange={handleRChange}
                    // Показываем ошибку локальную ИЛИ глобальную (от графика)
                    error={localErrors.r || globalRError}
                    icon={<RadarRoundedIcon />}
                />
            </motion.div>

            {/* КНОПКА ОТПРАВКИ */}
            <motion.div variants={itemVariants}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    component={motion.button}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    startIcon={<SendRoundedIcon />}
                    sx={{
                        mt: 1,
                        py: 1.5,
                        borderRadius: '20px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    }}
                >
                    Проверить
                </Button>
            </motion.div>
        </Paper>
    );
};

// --- ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ ДЛЯ КРАСИВОГО INPUT ---
const CustomTextField = ({ label, value, onChange, error, placeholder, icon }) => (
    <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, ml: 1 }}>
            {React.cloneElement(icon, { fontSize: 'small', sx: { color: error ? '#ef4444' : '#6366f1' } })}
            <Typography variant="subtitle2" fontWeight={600} color={error ? '#ef4444' : 'textSecondary'}>
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
            helperText={error && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <ErrorOutlineRoundedIcon fontSize="inherit" /> {error}
                </motion.span>
            )}
            InputProps={{
                disableUnderline: true, // Убираем линию снизу
                sx: {
                    borderRadius: '16px',
                    bgcolor: error ? '#fef2f2' : '#f8fafc', // Красный фон при ошибке
                    border: '2px solid',
                    borderColor: error ? '#fecaca' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: error ? '#fef2f2' : '#f1f5f9',
                    },
                    '&.Mui-focused': {
                        bgcolor: '#fff',
                        borderColor: error ? '#ef4444' : '#8b5cf6', // Фиолетовая рамка при фокусе
                        boxShadow: error ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : '0 0 0 4px rgba(139, 92, 246, 0.1)'
                    },
                    fontWeight: 600,
                    color: '#334155'
                }
            }}
        />
    </Box>
);

export default PointForm;