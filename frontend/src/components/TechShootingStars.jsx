import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Математика звезды (n - количество лучей)
const getStarPoints = (cx, cy, outerR, innerR, n) => {
    let points = [];
    const step = Math.PI / n;
    for (let i = 0; i < 2 * n; i++) {
        const r = (i % 2 === 0) ? outerR : innerR;
        const angle = i * step - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(" ");
};

// Компонент одной кометы
const Comet = ({ word, top, delay, duration, scale }) => {
    // 8-конечная звезда (как вы просили)
    const starShape = getStarPoints(270, 30, 25, 16, 9);
    const rotateDuration = 3 + Math.random() * 5;

    return (
        <motion.div
            initial={{ x: '-400px', opacity: 0 }}
            animate={{ x: '120vw', opacity: [0, 1, 1, 0] }}
            transition={{
                duration: duration, repeat: Infinity, delay: delay, ease: "linear", repeatDelay: 0.5
            }}
            style={{
                position: 'absolute', top: `${top}%`, width: '300px', height: '60px',
                transformOrigin: 'center right', scale: scale
            }}
        >
            <svg viewBox="0 0 300 60" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                    {/* Яркий, насыщенный градиент для тела звезды */}
                    <linearGradient id="starBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />   {/* Cyan 500 */}
                        <stop offset="50%" stopColor="#3b82f6" />   {/* Blue 500 */}
                        <stop offset="100%" stopColor="#7c3aed" />  {/* Violet 600 */}
                    </linearGradient>

                    {/* Градиент хвоста */}
                    <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                    </linearGradient>

                    {/* Сложный фильтр для контраста на ЛЮБОМ фоне */}
                    <filter id="contrastShadow" x="-50%" y="-50%" width="200%" height="200%">
                        {/* 1. Темная тень (Drop Shadow) для контраста на белом фоне */}
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blurOut"/>
                        <feOffset in="blurOut" dx="1" dy="2" result="offsetBlur"/>
                        <feComponentTransfer in="offsetBlur" result="shadow">
                            <feFuncA type="linear" slope="0.5"/> {/* Прозрачность тени */}
                        </feComponentTransfer>

                        {/* 2. Свечение (Glow) для контраста на темном фоне */}
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glow"/>

                        {/* 3. Собираем все слои */}
                        <feMerge>
                            <feMergeNode in="shadow"/>        {/* Тень снизу */}
                            <feMergeNode in="glow"/>          {/* Свечение */}
                            <feMergeNode in="SourceGraphic"/> {/* Сама звезда */}
                        </feMerge>
                    </filter>
                </defs>

                {/* Хвост */}
                <path
                    d="M 270 18 Q 120 29 100 30 Q 120 31 270 42 Z"
                    fill="url(#tailGradient)"
                />

                {/* Вращающаяся голова */}
                <motion.polygon
                    points={starShape}
                    fill="url(#starBodyGradient)"
                    filter="url(#contrastShadow)" // Применяем фильтр контраста
                    stroke="rgba(255, 255, 255, 0.6)" // Белая обводка для четкости границ
                    strokeWidth="1.5"

                    animate={{ rotate: 360 }}
                    transition={{ duration: rotateDuration, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '270px 30px' }}
                />

                {/* Текст */}
                <text
                    x="270"
                    y="30"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="50%" // Чуть крупнее
                    // Шрифт: используем системный стек sans-serif для чистоты, но очень жирный
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    fontWeight="800"
                    style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px', // Немного разрядки для читаемости
                        // Жесткая тень текста для читаемости на цветном фоне
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                >
                    {word}
                </text>
            </svg>
        </motion.div>
    );
};

// Главный компонент
const TechShootingStars = () => {
    const words = ['JSF', 'JSP', 'React', 'Vite', 'FastCGI', 'CSS', 'HTML', 'JS', 'EJB', 'Java', 'REST', 'ИТМО', 'КТУ', 'Нейро', 'ПИиКТ'];
    const stars = useMemo(() => Array.from({length: 6}).map((_, i) => ({
        id: i,
        word: words[Math.floor(Math.random() * words.length)],
        top:  Math.random() * 100,
        delay: i * 2.5,
        duration: 4 + Math.random() * 4,
        scale: 1.8 + Math.random() * 0.7
    })), []);

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
            {stars.map((star) => (
                <Comet key={star.id} {...star} />
            ))}
        </Box>
    );
};

export default TechShootingStars;