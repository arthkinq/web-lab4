import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setRError } from '../redux/pointsSlice';
import { motion } from 'framer-motion';
import { IconButton, Typography, Box, Chip, useTheme, useMediaQuery, Slider } from '@mui/material';
// Иконки
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

const SVG_SIZE = 300;
const AXIS_OFFSET = SVG_SIZE / 2;
const BASE_SCALE = 100;
const INITIAL_ZOOM = 1.1;
const MAX_ZOOM = 8;
const MIN_ZOOM = 0.5;

const Graph = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const { items: points, currentR } = useSelector((state) => state.points);

    const isRValid = !isNaN(currentR) && Number(currentR) > 0;

    const [isFullscreen, setIsFullscreen] = useState(false);

    // Transform State & Ref
    const [transform, setTransformState] = useState({ x: 0, y: 0, k: 1 });
    const transformRef = useRef({ x: 0, y: 0, k: 1 });

    const [cursorCoords, setCursorCoords] = useState(null);

    // --- REFS ---
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const zoomRef = useRef(null);
    const animationFrameRef = useRef(null); // Для анимации сброса

    // Refs для жестов
    const dragStartRef = useRef(null);
    const pinchStartRef = useRef(null);
    const isDraggingRef = useRef(false);

    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    // Синхронизация Ref и State
    const setTransform = (newValOrFunc) => {
        let newVal;
        if (typeof newValOrFunc === 'function') {
            newVal = newValOrFunc(transformRef.current);
        } else {
            newVal = newValOrFunc;
        }
        transformRef.current = newVal;
        setTransformState(newVal);
    };

    // --- ПАЛИТРА ---
    const colors = {
        bg: darkMode ? '#1e293b' : '#ffffff',
        grid: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(15, 23, 42, 0.05)',
        axis: darkMode ? '#64748b' : '#334155',
        text: darkMode ? '#94a3b8' : '#64748b',
        figureFill: '#3b82f6',
        pointHit: '#22c55e',
        pointMiss: '#ef4444',
        fullscreenBg: darkMode ? '#0f172a' : '#f8fafc',
        controlBg: darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    };

    // --- УТИЛИТЫ ---
    const clampOffset = (val, scale) => {
        const maxPan = (SVG_SIZE * scale) / 1.2;
        return Math.max(Math.min(val, maxPan), -maxPan);
    };

    const getMathCoordinates = (clientX, clientY) => {
        if (!svgRef.current) return null;
        const svg = svgRef.current;
        let pt = svg.createSVGPoint();
        pt.x = clientX; pt.y = clientY;

        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

        const t = transformRef.current;
        const mathX = ((svgP.x - t.x) / t.k - AXIS_OFFSET) / BASE_SCALE * currentR;
        const mathY = -((svgP.y - t.y) / t.k - AXIS_OFFSET) / BASE_SCALE * currentR;

        return { x: mathX, y: mathY };
    };

    // --- АНИМАЦИЯ (RESET VIEW) ---
    const animateViewTo = (targetX, targetY, targetK) => {
        const start = { ...transformRef.current };
        const startTime = performance.now();
        const duration = 400; // ms

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Easing: cubic out
            const ease = 1 - Math.pow(1 - progress, 3);

            const next = {
                x: start.x + (targetX - start.x) * ease,
                y: start.y + (targetY - start.y) * ease,
                k: start.k + (targetK - start.k) * ease
            };

            setTransform(next);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(step);
            }
        };

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(step);
    };

    // --- ЭФФЕКТЫ ---
    // Сброс при входе/выходе из Fullscreen
    useEffect(() => {
        if (isFullscreen) {
            // Плавно зумим при открытии
            animateViewTo(0, 0, INITIAL_ZOOM);
        } else {
            // Мгновенно сбрасываем при закрытии
            setTransform({ x: 0, y: 0, k: 1 });
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    }, [isFullscreen]);

    // --- EVENT HANDLERS ---

    // 1. КОЛЕСИКО (ZOOM)
    useEffect(() => {
        const el = zoomRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (!isFullscreen) return;
            e.preventDefault();

            // Останавливаем анимацию если юзер вмешался
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

            const t = transformRef.current;
            const delta = -e.deltaY * 0.002;
            const newK = Math.min(Math.max(MIN_ZOOM, t.k + delta), MAX_ZOOM);

            const rect = svgRef.current.getBoundingClientRect();
            const mx = (e.clientX - rect.left) * (SVG_SIZE / rect.width);
            const my = (e.clientY - rect.top) * (SVG_SIZE / rect.height);

            const newX = mx - (mx - t.x) * (newK / t.k);
            const newY = my - (my - t.y) * (newK / t.k);

            setTransform({ k: newK, x: newX, y: newY });
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [isFullscreen]);

    // 2. МЫШЬ (DESKTOP)
    const onMouseDown = (e) => {
        // ИСПРАВЛЕНИЕ: Убрали проверку (!isFullscreen), чтобы клики работали в маленьком режиме
        // Останавливаем анимацию
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        isDraggingRef.current = false;

        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            tx: transformRef.current.x,
            ty: transformRef.current.y,
            scaleFactor: svgRef.current.getBoundingClientRect().width / SVG_SIZE
        };
    };

    const onMouseMove = (e) => {
        const t = transformRef.current;
        const coords = getMathCoordinates(e.clientX, e.clientY);
        if (coords) setCursorCoords(coords);

        const ds = dragStartRef.current;

        // ИСПРАВЛЕНИЕ: Перемещаем график (драг) ТОЛЬКО если мы в Fullscreen
        if (ds && isFullscreen) {
            const dx = (e.clientX - ds.startX) / ds.scaleFactor;
            const dy = (e.clientY - ds.startY) / ds.scaleFactor;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDraggingRef.current = true;

            setTransform({
                ...t,
                x: clampOffset(ds.tx + dx, t.k),
                y: clampOffset(ds.ty + dy, t.k)
            });
        }
    };

    const onMouseUp = (e) => {
        // Если мы не тащили (или тащили мало), и есть начальная точка -> это клик
        if (!isDraggingRef.current && dragStartRef.current) {
            handleGraphClick(e.clientX, e.clientY);
        }
        dragStartRef.current = null;
        isDraggingRef.current = false;
    };

    const onMouseLeave = () => {
        dragStartRef.current = null;
        isDraggingRef.current = false;
        setCursorCoords(null);
    };

    // 3. ТАЧ (MOBILE)
    const onTouchStart = (e) => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        if (e.touches.length === 1) {
            const t = e.touches[0];
            isDraggingRef.current = false;
            dragStartRef.current = {
                startX: t.clientX,
                startY: t.clientY,
                tx: transformRef.current.x,
                ty: transformRef.current.y,
                scaleFactor: svgRef.current.getBoundingClientRect().width / SVG_SIZE
            };
        } else if (e.touches.length === 2 && isFullscreen) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

            pinchStartRef.current = {
                dist,
                k: transformRef.current.k,
                tx: transformRef.current.x,
                ty: transformRef.current.y,
                cx: (t1.clientX + t2.clientX) / 2,
                cy: (t1.clientY + t2.clientY) / 2
            };
        }
    };

    const onTouchMove = (e) => {
        if(isFullscreen && e.cancelable) e.preventDefault();

        const ds = dragStartRef.current;
        const ps = pinchStartRef.current;
        const t = transformRef.current;

        if (e.touches.length === 1 && ds) {
            const touch = e.touches[0];
            const dx = (touch.clientX - ds.startX) / ds.scaleFactor;
            const dy = (touch.clientY - ds.startY) / ds.scaleFactor;

            // ИСПРАВЛЕНИЕ: Драг работает только в Fullscreen
            if (isFullscreen) {
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDraggingRef.current = true;

                setTransform({
                    ...t,
                    x: clampOffset(ds.tx + dx, t.k),
                    y: clampOffset(ds.ty + dy, t.k)
                });
            }
        } else if (e.touches.length === 2 && ps && isFullscreen) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const ratio = dist / ps.dist;

            const newK = Math.min(Math.max(MIN_ZOOM, ps.k * ratio), MAX_ZOOM);

            const rect = svgRef.current.getBoundingClientRect();
            const mx = (ps.cx - rect.left) * (SVG_SIZE / rect.width);
            const my = (ps.cy - rect.top) * (SVG_SIZE / rect.height);

            const newX = mx - (mx - ps.tx) * (newK / ps.k);
            const newY = my - (my - ps.ty) * (newK / ps.k);

            setTransform({ k: newK, x: newX, y: newY });
        }
    };

    const onTouchEnd = (e) => {
        if (dragStartRef.current && !pinchStartRef.current && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const dist = Math.hypot(touch.clientX - dragStartRef.current.startX, touch.clientY - dragStartRef.current.startY);

            // Если сдвиг маленький (даже если isDragging случайно стал true из-за дрожания)
            if (dist < 10) {
                handleGraphClick(touch.clientX, touch.clientY);
            }
        }

        if (e.touches.length === 0) {
            dragStartRef.current = null;
            pinchStartRef.current = null;
            isDraggingRef.current = false;
        }
    };

    const handleGraphClick = (clientX, clientY) => {
        if (!isRValid) {
            dispatch(setRError("Выберите положительный R"));
            return;
        }
        const coords = getMathCoordinates(clientX, clientY);
        if (coords) {
            dispatch(addPoint({
                x: parseFloat(coords.x.toFixed(3)),
                y: parseFloat(coords.y.toFixed(3)),
                r: parseFloat(currentR)
            }));
        }
    };

    const AxisLabel = ({ x, y, label }) => (
        <text
            x={x} y={y}
            fill={colors.text} fontSize="10" fontFamily="monospace"
            textAnchor="middle" dominantBaseline="middle"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
            {label}
        </text>
    );

    return (
        <motion.div
            layout
            ref={containerRef}
            style={{
                position: isFullscreen ? 'fixed' : 'relative',
                inset: isFullscreen ? 0 : 'auto',
                width: isFullscreen ? '100vw' : '320px',
                height: isFullscreen ? '100dvh' : '360px',
                zIndex: isFullscreen ? 9999 : 1,
                background: isFullscreen ? colors.fullscreenBg : colors.bg,
                borderRadius: isFullscreen ? 0 : '24px',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: isFullscreen ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.1)',
                paddingTop: isFullscreen ? 'env(safe-area-inset-top)' : 0,
                paddingBottom: isFullscreen ? 'env(safe-area-inset-bottom)' : 0,
            }}
        >
            {/* ШАПКА */}
            <Box sx={{
                p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: `1px solid ${colors.grid}`, zIndex: 10, bgcolor: colors.bg,
                ...(isFullscreen && isMobile && {
                    position: 'absolute', top: 0, left: 0, width: '100%',
                    bgcolor: 'rgba(255,255,255,0.0)', borderBottom: 'none', pointerEvents: 'none'
                })
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pointerEvents: 'auto' }}>
                    <Chip
                        label={`R = ${Number(currentR).toFixed(1)}`}
                        size="small" color={isRValid ? "primary" : "default"}
                        sx={{ boxShadow: isFullscreen ? '0 2px 5px rgba(0,0,0,0.2)' : 'none' }}
                    />
                    {isFullscreen && cursorCoords && !isMobile && (
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: colors.text }}>
                            [{cursorCoords.x.toFixed(2)}, {cursorCoords.y.toFixed(2)}]
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, pointerEvents: 'auto' }}>
                    {isFullscreen && !isMobile && (
                        <IconButton size="small" onClick={() => animateViewTo(0, 0, INITIAL_ZOOM)}>
                            <CenterFocusStrongIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton
                        size="small"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        sx={{ bgcolor: isFullscreen ? 'rgba(239, 68, 68, 0.1)' : colors.grid, backdropFilter: 'blur(4px)' }}
                    >
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* ОБЛАСТЬ SVG */}
            <Box
                ref={zoomRef}
                sx={{ flexGrow: 1, position: 'relative', touchAction: 'none', overflow: 'hidden' }}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            >
                {/* Всплывашка для мобилок */}
                {isFullscreen && isMobile && cursorCoords && (
                    <Box sx={{
                        position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
                        bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', px: 2, py: 0.5, borderRadius: '20px',
                        zIndex: 20, pointerEvents: 'none', fontSize: '12px'
                    }}>
                        X: {cursorCoords.x.toFixed(2)} Y: {cursorCoords.y.toFixed(2)}
                    </Box>
                )}

                <svg ref={svgRef} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} width="100%" height="100%" style={{ display: 'block' }}>
                    <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={colors.grid} strokeWidth="1"/>
                        </pattern>
                    </defs>

                    <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
                        <g transform={`translate(${AXIS_OFFSET}, ${AXIS_OFFSET})`}>
                            <rect x="-2000" y="-2000" width="4000" height="4000" fill="url(#grid)" />

                            {isRValid && (
                                <>
                                    <path d={`M 0 0 L 0 ${-BASE_SCALE/2} A ${BASE_SCALE/2} ${BASE_SCALE/2} 0 0 1 ${BASE_SCALE/2} 0 Z`}
                                          fill={colors.figureFill} fillOpacity="0.25" stroke={colors.figureFill} strokeWidth="1" />
                                    <rect x={-BASE_SCALE/2} y={-BASE_SCALE} width={BASE_SCALE/2} height={BASE_SCALE}
                                          fill={colors.figureFill} fillOpacity="0.25" stroke={colors.figureFill} strokeWidth="1" />
                                    <polygon points={`0,0 ${BASE_SCALE},0 0,${BASE_SCALE}`}
                                             fill={colors.figureFill} fillOpacity="0.25" stroke={colors.figureFill} strokeWidth="1" />
                                </>
                            )}

                            {/* ОСИ */}
                            <line x1="-155" y1="0" x2="155" y2="0" stroke={colors.axis} strokeWidth="1.5" />
                            <line x1="0" y1="-155" x2="0" y2="155" stroke={colors.axis} strokeWidth="1.5" />
                            <polygon points="155,0 150,-3 150,3" fill={colors.axis} />
                            <polygon points="0,-155 -3,-150 3,-150" fill={colors.axis} />

                            {/* МЕТКИ */}
                            {isRValid && (
                                <>
                                    <line x1={BASE_SCALE} y1="-3" x2={BASE_SCALE} y2="3" stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x={BASE_SCALE} y="15" label="R" />
                                    <line x1={BASE_SCALE/2} y1="-3" x2={BASE_SCALE/2} y2="3" stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x={BASE_SCALE/2} y="15" label="R/2" />
                                    <line x1={-BASE_SCALE} y1="-3" x2={-BASE_SCALE} y2="3" stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x={-BASE_SCALE} y="15" label="-R" />
                                    <line x1={-BASE_SCALE/2} y1="-3" x2={-BASE_SCALE/2} y2="3" stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x={-BASE_SCALE/2} y="15" label="-R/2" />

                                    <line x1="-3" y1={-BASE_SCALE} x2="3" y2={-BASE_SCALE} stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x="-15" y={-BASE_SCALE} label="R" />
                                    <line x1="-3" y1={-BASE_SCALE/2} x2="3" y2={-BASE_SCALE/2} stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x="-20" y={-BASE_SCALE/2} label="R/2" />
                                    <line x1="-3" y1={BASE_SCALE} x2="3" y2={BASE_SCALE} stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x="-15" y={BASE_SCALE} label="-R" />
                                    <line x1="-3" y1={BASE_SCALE/2} x2="3" y2={BASE_SCALE/2} stroke={colors.axis} strokeWidth="1"/>
                                    <AxisLabel x="-20" y={BASE_SCALE/2} label="-R/2" />
                                </>
                            )}

                            {/* ТОЧКИ */}
                            {points.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={(p.x/currentR)*BASE_SCALE}
                                    cy={-(p.y/currentR)*BASE_SCALE}
                                    r={4/transform.k}
                                    fill={p.hit ? colors.pointHit : colors.pointMiss}
                                    stroke={colors.bg}
                                    strokeWidth={1/transform.k}
                                />
                            ))}
                        </g>
                    </g>
                </svg>
            </Box>

            {/* НИЖНЯЯ ПАНЕЛЬ (MOBILE) */}
            {isFullscreen && isMobile && (
                <Box sx={{ p: 2, bgcolor: colors.controlBg, borderTop: `1px solid ${colors.grid}`, pb: 'calc(10px + env(safe-area-inset-bottom))', backdropFilter: 'blur(10px)' }}>
                    <Typography variant="caption" sx={{ color: colors.text, display: 'block', mb: 1 }}>Изменить радиус:</Typography>
                    <Slider
                        value={currentR} min={1} max={4} step={1}
                        marks
                        onChange={(e, v) => dispatch(setR(v))}
                    />
                </Box>
            )}
        </motion.div>
    );
};

export default Graph;