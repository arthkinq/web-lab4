import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTable } from '../redux/pointsSlice';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// --- ФУНКЦИЯ ФОРМАТИРОВАНИЯ ДАТЫ ---
const formatDate = (dateData) => {
    if (!dateData) return "—";

    // Если Java прислала массив [год, месяц, день, часы, минуты, секунды, нано]
    if (Array.isArray(dateData)) {
        const [year, month, day, hour, minute, second] = dateData;
        // Важно: в JS месяцы считаются с 0 (январь=0), а в Java с 1. Поэтому "month - 1".
        return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
    }

    // Если пришла строка ISO
    return new Date(dateData).toLocaleString();
};

const ResultsTable = () => {
    const dispatch = useDispatch();
    const points = useSelector((state) => state.points.items);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirm = () => {
        dispatch(clearTable());
        setOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Результаты</Typography>
                {points.length > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleClickOpen}
                    >
                        Очистить
                    </Button>
                )}
            </Box>

            <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>X</TableCell>
                            <TableCell>Y</TableCell>
                            <TableCell>R</TableCell>
                            <TableCell>Результат</TableCell>
                            <TableCell>Время</TableCell>
                            <TableCell>Скрипт</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {points.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Нет данных</TableCell>
                            </TableRow>
                        ) : (
                            points.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.x}</TableCell>
                                    <TableCell>{row.y}</TableCell>
                                    <TableCell>{row.r}</TableCell>
                                    <TableCell sx={{ color: row.hit ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {row.hit ? 'Попал' : 'Мимо'}
                                    </TableCell>

                                    {/* ИСПОЛЬЗУЕМ НАШУ ФУНКЦИЮ ЗДЕСЬ */}
                                    <TableCell>{formatDate(row.timestamp)}</TableCell>

                                    <TableCell>{(row.executionTime / 1000000).toFixed(3)} ms</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Очистка истории"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить все результаты проверок?
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Отмена</Button>
                    <Button onClick={handleConfirm} color="error" autoFocus>Удалить</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ResultsTable;