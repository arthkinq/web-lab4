import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setRError, setR } from '../redux/pointsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Paper, IconButton, Typography, Box, Slider, Chip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const SVG_SIZE = 300;
const AXIS_OFFSET = SVG_SIZE / 2;
const BASE_SCALE = 100;
const INITIAL_ZOOM = 1.2;
const MAX_ZOOM = 8;

const Graph = () => {
    const dispatch = useDispatch();
    const { items: points, currentR } = useSelector((state) => state.points);
    const isRValid = !isNaN(currentR) && currentR >= 1 && currentR <= 4;

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [cursorCoords, setCursorCoords] = useState(null);

    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const dragStartRef = useRef(null);
    const animationFrameRef = useRef(null);

    // НОВЫЙ REF ДЛЯ ЗУМА (чтобы привязать событие вручную)
    const zoomRef = useRef(null);

    // --- ЛОГИКА ОГРАНИЧЕНИЙ ---
    const clampOffset = (val, scale) => {
        const maxPan = (SVG_SIZE * scale) / 1.2;
        return Math.max(Math.min(val, maxPan), -maxPan);
    };

    const getMathCoordinates = (clientX, clientY) => {
        if (!svgRef.current) return null;

        const svg = svgRef.current;
        let point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;

        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        const internalX = (svgPoint.x - transform.x) / transform.k;
        const internalY = (svgPoint.y - transform.y) / transform.k;

        const centeredX = internalX - AXIS_OFFSET;
        const centeredY = internalY - AXIS_OFFSET;

        const mathX = (centeredX / BASE_SCALE) * currentR;
        const mathY = -(centeredY / BASE_SCALE) * currentR;

        return { x: mathX, y: mathY };
    };

    // --- АНИМАЦИЯ ---
    const animateViewTo = (targetX, targetY, targetK, duration = 500) => {
        const start = { ...transform };
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            let nextK = start.k + (targetK - start.k) * ease;
            let nextX = start.x + (targetX - start.x) * ease;
            let nextY = start.y + (targetY - start.y) * ease;

            nextX = clampOffset(nextX, nextK);
            nextY = clampOffset(nextY, nextK);

            setTransform({ x: nextX, y: nextY, k: nextK });
            if (progress < 1) animationFrameRef.current = requestAnimationFrame(step);
        };

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        if (isFullscreen) {
            animateViewTo(0, 0, INITIAL_ZOOM, 600);
        } else {
            setTransform({ x: 0, y: 0, k: 1 });
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    }, [isFullscreen]);

    const handleResetView = () => {
        animateViewTo(0, 0, INITIAL_ZOOM);
    };

    const getScreenScale = () => {
        if (svgRef.current) {
            const ctm = svgRef.current.getScreenCTM();
            return ctm ? ctm.a : 1;
        }
        return 1;
    };

    // --- ZOOM (WHEEL) ---
    const handleWheel = (e) => {
        if (!isFullscreen) return;

        // e.preventDefault() вызывается здесь, но чтобы это работало без ошибки,
        // слушатель должен быть добавлен с { passive: false } (см. useEffect ниже)
        e.preventDefault();

        const zoomSensitivity = 0.005;
        const delta = -e.deltaY * zoomSensitivity;

        const oldScale = transform.k;
        const newScale = Math.min(Math.max(INITIAL_ZOOM, oldScale + delta), MAX_ZOOM);

        const rect = svgRef.current.getBoundingClientRect();
        const mouseX_Screen = e.clientX - rect.left;
        const mouseY_Screen = e.clientY - rect.top;
        const screenScale = getScreenScale();

        const mouseX_SVG = mouseX_Screen / screenScale;
        const mouseY_SVG = mouseY_Screen / screenScale;

        let newX = mouseX_SVG - (mouseX_SVG - transform.x) * (newScale / oldScale);
        let newY = mouseY_SVG - (mouseY_SVG - transform.y) * (newScale / oldScale);

        newX = clampOffset(newX, newScale);
        newY = clampOffset(newY, newScale);

        setTransform({ k: newScale, x: newX, y: newY });
    };

    // --- ИСПРАВЛЕНИЕ ОШИБКИ PASSIVE LISTENER ---
    // Используем ref, чтобы хранить актуальную версию функции handleWheel,
    // но не пересоздавать слушатель событий DOM при каждом рендере.
    const handleWheelRef = useRef(handleWheel);
    handleWheelRef.current = handleWheel; // Обновляем реф на каждом рендере

    useEffect(() => {
        const element = zoomRef.current;
        if (!element) return;

        const listener = (e) => {
            // Вызываем актуальную функцию из рефа
            handleWheelRef.current(e);
        };

        // ВАЖНО: { passive: false } разрешает нам делать e.preventDefault()
        element.addEventListener('wheel', listener, { passive: false });

        return () => {
            element.removeEventListener('wheel', listener);
        };
    }, []); // Пустой массив зависимостей = навешиваем один раз

    // --- DRAG ---
    const onStart = (clientX, clientY) => {
        if (!isFullscreen) return;
        setIsDragging(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        dragStartRef.current = {
            screenX: clientX, screenY: clientY,
            startTx: transform.x, startTy: transform.y,
            scaleFactor: getScreenScale()
        };
    };

    const onMove = (clientX, clientY) => {
        const coords = getMathCoordinates(clientX, clientY);
        if (coords) setCursorCoords(coords);

        const dragStart = dragStartRef.current;
        if (dragStart) {
            const dx_Screen = clientX - dragStart.screenX;
            const dy_Screen = clientY - dragStart.screenY;
            if (Math.abs(dx_Screen) > 5 || Math.abs(dy_Screen) > 5) setIsDragging(true);

            const dx_SVG = dx_Screen / dragStart.scaleFactor;
            const dy_SVG = dy_Screen / dragStart.scaleFactor;

            let newX = dragStart.startTx + dx_SVG;
            let newY = dragStart.startTy + dy_SVG;

            newX = clampOffset(newX, transform.k);
            newY = clampOffset(newY, transform.k);

            setTransform(prev => ({ ...prev, x: newX, y: newY }));
        }
    };

    const onEnd = (e, clientX, clientY) => {
        const wasDragging = isDragging;
        dragStartRef.current = null;
        setIsDragging(false);

        if (!wasDragging && clientX && clientY) {
            handleGraphClick(clientX, clientY);
        }
    };

    const handleMouseDown = (e) => onStart(e.clientX, e.clientY);
    const handleMouseMove = (e) => onMove(e.clientX, e.clientY);
    const handleMouseUp = (e) => onEnd(e, e.clientX, e.clientY);
    const handleMouseLeave = () => {
        dragStartRef.current = null;
        setIsDragging(false);
        setCursorCoords(null);
    };

    const handleTouchStart = (e) => { if(e.touches.length === 1) onStart(e.touches[0].clientX, e.touches[0].clientY); };
    const handleTouchMove = (e) => {
        if(e.touches.length === 1) {
            const t = e.touches[0];
            onMove(t.clientX, t.clientY);
        }
    };
    const handleTouchEnd = (e) => { if(e.changedTouches.length > 0) { const t = e.changedTouches[0]; onEnd(e, t.clientX, t.clientY); } };

    // --- CLICK ---
    const handleGraphClick = (clientX, clientY) => {
        if (!isRValid) {
            dispatch(setRError("Выберите корректный R (1...4)!"));
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

    // --- STYLES ---
    let cursorStyle = !isRValid ? 'not-allowed' : (isFullscreen && isDragging ? 'grabbing' : (isFullscreen ? 'grab' : 'crosshair'));

    const AxisText = ({ x, y, children, fontWeight = '500' }) => (
        <text
            x={x} y={y} fontSize="11" fontWeight={fontWeight} textAnchor="middle" dominantBaseline="middle"
            fill="#475569" style={{ userSelect: 'none', pointerEvents: 'none', fontFamily: 'Roboto, sans-serif' }}
        >
            {children}
        </text>
    );

    const containerStyles = isFullscreen ? {
        position: 'fixed', top: '5%', left: '5%', width: '90%', height: '90%', zIndex: 999, borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        border: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #FF6FD8 0%, #3813C2 100%)',
        backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none'
    } : {
        position: 'relative', width: '300px', height: '300px', zIndex: 1, background: 'white', borderRadius: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none', transition: 'box-shadow 0.3s ease'
    };

    return (
        <>
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(50, 50, 70, 0.6)', backdropFilter: 'blur(4px)', zIndex: 998 }}
                        onClick={() => setIsFullscreen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                layout
                ref={containerRef}
                style={containerStyles}
                whileHover={!isFullscreen ? { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
                {/* --- HEADER --- */}
                <Box sx={{
                    p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: isFullscreen ? 'rgba(255,255,255,0.5)' : '#fff',
                    borderBottom: '1px solid rgba(0,0,0,0.05)', gap: 2
                }}>
                    {isFullscreen ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '180px', px: 1, width: '50%' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', minWidth: '50px', fontVariant: 'tabular-nums' }}>
                                    R={Number(currentR).toFixed(1)}
                                </Typography>
                                <Slider
                                    value={typeof currentR === 'number' ? currentR : 1}
                                    min={1} max={4} step={0.1} marks
                                    sx={{ color: '#6366f1', width: '50%', py: 1.5 }}
                                    onChange={(e, val) => dispatch(setR(val))}
                                />
                            </Box>

                            <AnimatePresence mode='wait'>
                                {cursorCoords ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                        key="coords"
                                    >
                                        <Chip
                                            icon={<GpsFixedIcon style={{ fontSize: 14 }} />}
                                            label={`X: ${cursorCoords.x.toFixed(2)}  Y: ${cursorCoords.y.toFixed(2)}`}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                fontFamily: 'monospace', fontWeight: 600,
                                                bgcolor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#4f46e5'
                                            }}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="placeholder">
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Наведите на график</Typography>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    ) : (
                        <Typography variant="subtitle2" sx={{ ml: 1, color: '#475569', fontWeight: 800, letterSpacing: '0.5px' }}>
                            AREA CHECK
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isFullscreen && (
                            <>
                                <IconButton size="small" onClick={handleResetView} sx={{ color: '#3b82f6', bgcolor: '#eff6ff' }}><CenterFocusStrongIcon fontSize="small" /></IconButton>
                                <IconButton size="small" onClick={() => animateViewTo(transform.x, transform.y, Math.min(transform.k + 0.5, MAX_ZOOM))} sx={{ color: '#8b5cf6', bgcolor: '#f5f3ff' }}><ZoomInIcon fontSize="small"/></IconButton>
                                <IconButton size="small" onClick={() => animateViewTo(transform.x, transform.y, Math.max(transform.k - 0.5, INITIAL_ZOOM))} sx={{ color: '#8b5cf6', bgcolor: '#f5f3ff' }}><ZoomOutIcon fontSize="small"/></IconButton>
                            </>
                        )}
                        <IconButton
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            sx={{
                                bgcolor: isFullscreen ? '#fee2e2' : '#f1f5f9',
                                color: isFullscreen ? '#ef4444' : '#64748b',
                                '&:hover': { bgcolor: isFullscreen ? '#fecaca' : '#e2e8f0'}

                            }}
                        >
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {/* --- SVG AREA --- */}
                <Box
                    // ИСПРАВЛЕНИЕ: Добавлен ref для ручного слушателя событий
                    ref={zoomRef}
                    sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden', cursor: cursorStyle, touchAction: 'none' }}
                    // onWheel удален отсюда, теперь он в useEffect
                    onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
                >
                    <svg ref={svgRef} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                            </pattern>
                        </defs>

                        <motion.g
                            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
                            style={{ transformOrigin: '0 0' }}
                            transition={{ type: "tween", ease: "linear", duration: 0 }}
                        >
                            <g transform={`translate(${AXIS_OFFSET}, ${AXIS_OFFSET})`}>
                                <rect x="-2000" y="-2000" width="4000" height="4000" fill="url(#grid)" />

                                {/* FIGURES */}
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <polygon points={`0,0 ${-BASE_SCALE/2},0 ${-BASE_SCALE/2},${-BASE_SCALE} 0,${-BASE_SCALE}`} fill="#3b82f6" fillOpacity="0.6" />
                                    <path d={`M 0 0 L 0 ${-BASE_SCALE/2} A ${BASE_SCALE/2} ${BASE_SCALE/2} 0 0 1 ${BASE_SCALE/2} 0 Z`} fill="#3b82f6" fillOpacity="0.6" />
                                    <polygon points={`0,0 ${BASE_SCALE},0 0,${BASE_SCALE}`} fill="#3b82f6" fillOpacity="0.6" />
                                </motion.g>

                                {/* AXES */}
                                <g>
                                    <line x1={-BASE_SCALE * 1.5 + 5} y1="0" x2={BASE_SCALE * 1.5 - 5} y2="0" stroke="#334155" strokeWidth={2 / transform.k} strokeLinecap="round" />
                                    <polygon points={`${BASE_SCALE*1.5},0 ${BASE_SCALE*1.5-5},-3 ${BASE_SCALE*1.5-5},3`} fill="#334155" />
                                    <line x1="0" y1={-BASE_SCALE * 1.5 + 5} x2="0" y2={BASE_SCALE * 1.5 - 5} stroke="#334155" strokeWidth={2 / transform.k} strokeLinecap="round" />
                                    <polygon points={`0,${-BASE_SCALE*1.5} -3,${-BASE_SCALE*1.5+5} 3,${-BASE_SCALE*1.5+5}`} fill="#334155" />
                                </g>

                                {/* LABELS */}
                                <g>
                                    <AxisText x={BASE_SCALE} y={15}>R</AxisText>
                                    <AxisText x={BASE_SCALE/2} y={15}>R/2</AxisText>
                                    <AxisText x={-BASE_SCALE} y={15}>-R</AxisText>
                                    <AxisText x={-BASE_SCALE/2} y={15}>-R/2</AxisText>
                                    <AxisText x={-15} y={-BASE_SCALE}>R</AxisText>
                                    <AxisText x={-20} y={-BASE_SCALE/2}>R/2</AxisText>
                                    <AxisText x={-15} y={BASE_SCALE}>-R</AxisText>
                                    <AxisText x={-20} y={BASE_SCALE/2}>-R/2</AxisText>

                                    <AxisText x={BASE_SCALE * 1.6} y={1} fontWeight="900">X</AxisText>
                                    <AxisText x={1} y={-BASE_SCALE * 1.6} fontWeight="900">Y</AxisText>
                                </g>

                                {/* HISTORY POINTS */}
                                {isRValid && points.map((p, index) => (
                                    <motion.circle
                                        key={p.id || index}
                                        cx={(p.x / currentR) * BASE_SCALE}
                                        cy={-(p.y / currentR) * BASE_SCALE}
                                        r={5 / transform.k}
                                        fill={p.hit ? '#4ade80' : '#f87171'}
                                        stroke="#fff"
                                        strokeWidth={2 / transform.k}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        whileHover={{ scale: 1.5, cursor: 'help' }}
                                    />
                                ))}
                            </g>
                        </motion.g>
                    </svg>
                </Box>
            </motion.div>
        </>
    );
};

export default Graph;