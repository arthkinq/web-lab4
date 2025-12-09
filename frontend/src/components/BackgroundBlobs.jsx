import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const BackgroundBlobs = ({ darkMode }) => {
    // Цвета для светлой и темной темы
    const colors = {
        blob1: darkMode ? '#4f46e5' : '#a855f7', // Indigo / Purple
        blob2: darkMode ? '#0891b2' : '#22d3ee', // Cyan (под цвет звезд)
        blob3: darkMode ? '#be185d' : '#ec4899', // Pink
    };

    // Общая прозрачность (в темной теме поменьше, чтобы не слепило)
    const opacity = darkMode ? 0.3 : 0.45;

    return (
        <Box sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
        }}>

            {/* BLOB 1: Большой Фиолетовый (Слева сверху) */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                    rotate: [0, 180, 360], // Полный оборот
                    // Морфинг формы (из круга в огурец и обратно)
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '60vw',
                    height: '60vw',
                    backgroundColor: colors.blob1,
                    opacity: opacity,
                    filter: 'blur(60px)', // Чуть меньше блюра, чтобы видеть форму
                    mixBlendMode: darkMode ? 'screen' : 'multiply' // Режим смешивания для красивых пересечений
                }}
            />

            {/* BLOB 2: Циан/Голубой (Справа снизу) - Под цвет звезд */}
            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 100, -50, 0],
                    scale: [1, 1.3, 0.8, 1],
                    rotate: [0, -180, -360], // Обратное вращение
                    borderRadius: [
                        "40% 60% 70% 30% / 40% 40% 60% 50%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "40% 60% 70% 30% / 40% 40% 60% 50%"
                    ]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '55vw',
                    height: '55vw',
                    backgroundColor: colors.blob2,
                    opacity: opacity,
                    filter: 'blur(50px)',
                    mixBlendMode: darkMode ? 'screen' : 'multiply'
                }}
            />

            {/* BLOB 3: Розовый акцент (Гуляет по центру) */}
            <motion.div
                animate={{
                    x: [0, 150, -150, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 0.8, 1.2, 1],
                    borderRadius: [
                        "50% 50% 50% 50% / 50% 50% 50% 50%",
                        "30% 70% 70% 30% / 30% 30% 70% 70%",
                        "50% 50% 50% 50% / 50% 50% 50% 50%"
                    ]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '20%',
                    width: '40vw',
                    height: '40vw',
                    backgroundColor: colors.blob3,
                    opacity: opacity * 0.8, // Чуть прозрачнее
                    filter: 'blur(45px)',
                    mixBlendMode: darkMode ? 'screen' : 'multiply'
                }}
            />
        </Box>
    );
};

export default BackgroundBlobs;