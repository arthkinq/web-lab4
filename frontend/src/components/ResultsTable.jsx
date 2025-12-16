import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTable, setCurrentPage } from '../redux/pointsSlice';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Chip, IconButton, Tooltip, TablePagination
} from '@mui/material';
import { motion } from 'framer-motion';

// Иконки
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded'; // Иконка для себя

const formatDate = (dateData) => {
    if (!dateData) return "—";
    const dateObj = Array.isArray(dateData)
        ? new Date(dateData[0], dateData[1] - 1, dateData[2], dateData[3], dateData[4], dateData[5])
        : new Date(dateData);

    return dateObj.toLocaleString('ru-RU', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

const ResultsTable = () => {
    const dispatch = useDispatch();
    const { items: points, currentPage, itemsPerPage } = useSelector((state) => state.points);
    const darkMode = useSelector((state) => state.theme.darkMode);
    const currentUsername = useSelector((state) => state.auth.username); // Получаем имя текущего пользователя

    const [open, setOpen] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirm = () => {
        dispatch(clearTable());
        setOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        dispatch(setCurrentPage(newPage));
    };

    const visibleRows = points.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const theme = {
        cardBg: darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.6)',
        text: darkMode ? '#f1f5f9' : '#334155',
        subText: darkMode ? '#94a3b8' : '#64748b',
        headerBg: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255,255,255,0.4)',
        tableHeadBg: darkMode ? 'rgba(30, 41, 59, 0.98)' : 'rgba(248, 250, 252, 0.98)',
        rowHover: darkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.5)',
        iconBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#eff6ff',
        dialogBg: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        currentUserText: darkMode ? '#818cf8' : '#4f46e5' // Цвет для своего имени
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <Paper
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setIsScrollable(true)}
            elevation={0}
            sx={{
                borderRadius: '28px',
                background: theme.cardBg,
                backdropFilter: 'blur(12px)',
                border: theme.border,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                clipPath: 'inset(0px round 28px)',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                height: '100%', maxHeight: '600px',
                transform: 'translate3d(0,0,0)'
            }}
        >
            {/* HEADER */}
            <Box sx={{
                p: 2, px: 3,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: theme.headerBg,
                borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                zIndex: 2, flexShrink: 0
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1, borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white', display: 'flex'
                    }}>
                        <HistoryEduRoundedIcon fontSize="small" />
                    </Box>
                    <Typography variant="h6" fontWeight={700} color={theme.text}>
                        История
                    </Typography>
                    <Chip label={`${points.length}`} size="small" sx={{ bgcolor: theme.iconBg, color: '#6366f1', fontWeight: 800, borderRadius: '8px' }} />
                </Box>

                {points.length > 0 && (
                    <Tooltip title="Очистить таблицу">
                        <IconButton onClick={handleClickOpen} sx={{ color: '#ef4444', bgcolor: darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', '&:hover': { bgcolor: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2' }, borderRadius: '12px' }}>
                            <DeleteSweepRoundedIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* TABLE CONTAINER */}
            <TableContainer sx={{
                flexGrow: 1,
                overflowY: isScrollable ? 'auto' : 'hidden',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '4px',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: `${darkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)'} transparent`
            }}>
                <Table stickyHeader size="medium" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                    <TableHead>
                        <TableRow>
                            {['X', 'Y', 'R', 'Результат', 'Пользователь', 'Время', 'Скрипт'].map((head, i) => (
                                <TableCell key={i} sx={{
                                    bgcolor: theme.tableHeadBg, backdropFilter: 'blur(8px)',
                                    color: theme.subText, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px',
                                    borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                                    py: 2, borderTop: 'none'
                                }}>
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {points.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ borderBottom: 'none', py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.5, color: theme.subText }}>
                                        <HistoryEduRoundedIcon sx={{ fontSize: 48 }} />
                                        <Typography variant="body2">История пуста</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleRows.map((row) => {
                                // ПРОВЕРКА НА ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
                                const isMe = row.user?.username === currentUsername;

                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        // ОСТАВЛЯЕМ ТОЛЬКО ПРОСТУЮ АНИМАЦИЮ ПОЯВЛЕНИЯ
                                        // Убираем AnimatePresence и layout, чтобы не было скачков
                                        component={motion.tr}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}

                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            transition: 'background 0.2s',
                                            '&:hover': { bgcolor: theme.rowHover },
                                            // Если это мои строки, можно их чуть подсветить фоном (опционально)
                                            bgcolor: isMe && darkMode ? 'rgba(99, 102, 241, 0.05)' : (isMe ? '#f5f3ff' : 'transparent')
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600, color: theme.text, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>{Number(row.x).toFixed(3)}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: theme.text, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>{Number(row.y).toFixed(3)}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: theme.text, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>{row.r}</TableCell>

                                        <TableCell sx={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>
                                            <Chip
                                                icon={row.hit ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon />}
                                                label={row.hit ? 'Попал' : 'Мимо'}
                                                size="small"
                                                variant={row.hit ? 'filled' : 'outlined'}
                                                sx={{
                                                    fontWeight: 700, borderRadius: '8px',
                                                    ...(row.hit ? {
                                                        bgcolor: darkMode ? 'rgba(22, 101, 52, 0.3)' : '#dcfce7', color: darkMode ? '#4ade80' : '#166534',
                                                        '& .MuiChip-icon': { color: darkMode ? '#4ade80' : '#166534' }
                                                    } : {
                                                        borderColor: darkMode ? 'rgba(239, 68, 68, 0.5)' : '#fee2e2', color: darkMode ? '#f87171' : '#b91c1c', bgcolor: darkMode ? 'rgba(185, 28, 28, 0.1)' : '#fef2f2',
                                                        '& .MuiChip-icon': { color: '#ef4444' }
                                                    })
                                                }}
                                            />
                                        </TableCell>

                                        {/* --- КОЛОНКА ПОЛЬЗОВАТЕЛЬ (ВЫДЕЛЕНИЕ) --- */}
                                        <TableCell sx={{ borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 1,
                                                // Цвет для себя - яркий, для остальных - обычный текст
                                                color: isMe ? theme.currentUserText : theme.text,
                                                fontWeight: isMe ? 800 : 600
                                            }}>
                                                {isMe ? (
                                                    <StarRoundedIcon sx={{ fontSize: 18, color: theme.currentUserText }} />
                                                ) : (
                                                    <PersonRoundedIcon sx={{ fontSize: 16, color: theme.subText }} />
                                                )}
                                                {row.user?.username || '—'}
                                            </Box>
                                        </TableCell>

                                        <TableCell sx={{ color: theme.subText, fontFamily: 'monospace', fontSize: '0.85rem', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeRoundedIcon fontSize="inherit" />
                                                {formatDate(row.timestamp)}
                                            </Box>
                                        </TableCell>

                                        <TableCell sx={{ color: theme.subText, fontFamily: 'monospace', fontSize: '0.85rem', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(224, 224, 224, 1)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <CodeRoundedIcon fontSize="inherit" />
                                                {(row.executionTime / 1000000).toFixed(2)} ms
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={points.length}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={itemsPerPage}
                rowsPerPageOptions={[]}
                labelRowsPerPage=""
                sx={{
                    color: theme.subText,
                    borderTop: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    '.MuiTablePagination-toolbar': { minHeight: '52px', paddingLeft: 2, paddingRight: 2, justifyContent: 'center' },
                    '.MuiTablePagination-spacer': { display: 'none' },
                    '.MuiTablePagination-actions button': { color: theme.text, '&.Mui-disabled': { opacity: 0.3 } }
                }}
            />

            <Dialog
                open={open} onClose={handleClose}
                PaperProps={{ sx: { borderRadius: '24px', padding: 1, backdropFilter: 'blur(10px)', background: theme.dialogBg, border: theme.border } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: theme.text }}>Очистить историю?</DialogTitle>
                <DialogContent><DialogContentText sx={{ color: theme.subText }}>Это действие удалит все результаты проверок.</DialogContentText></DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} sx={{ borderRadius: '12px', color: theme.subText, fontWeight: 600 }}>Отмена</Button>
                    <Button onClick={handleConfirm} variant="contained" color="error" startIcon={<DeleteSweepRoundedIcon />} sx={{ borderRadius: '12px', boxShadow: 'none', fontWeight: 600 }}>Удалить всё</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ResultsTable;