import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPoint, setR, setRError } from '../redux/pointsSlice';
import { Paper, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

const PointForm = () => {
    const dispatch = useDispatch();
    const currentR = useSelector((state) => state.points.currentR);
    const globalRError = useSelector((state) => state.points.rError);

    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [rLocal, setRLocal] = useState(currentR);

    const [localErrors, setLocalErrors] = useState({ y: '', r: '' });

    useEffect(() => {
        setRLocal(currentR);
    }, [currentR]);

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
            newErrors.y = 'Y должен быть числом от -3 до 3';
            isValid = false;
        }

        const rVal = parseFloat(String(rLocal).replace(',', '.'));
        if (isNaN(rVal) || rVal < 1 || rVal > 4) {
            newErrors.r = 'R должен быть числом от 1 до 4';
            isValid = false;
        }

        setLocalErrors(newErrors);

        if (isValid) {
            dispatch(addPoint({ x, y: yVal, r: rVal }));
        }
    };

    const xValues = ['-2','-1.5','-1','-0.5','0','0.5','1','1.5'];

    return (
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>Параметры</Typography>


            <Box>
                <Typography variant="subtitle2" gutterBottom>Выберите X:</Typography>
                <ToggleButtonGroup
                    value={String(x)}
                    exclusive
                    onChange={(e, val) => val && setX(Number(val))}
                    size="small"
                    color="primary"
                    sx={{ flexWrap: 'wrap', gap: 0.5 }}
                >
                    {xValues.map(v => (
                        <ToggleButton key={v} value={v} sx={{ borderRadius: '4px !important', border: '1px solid rgba(0, 0, 0, 0.12) !important' }}>{v}</ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>


            <Box>
                <Typography variant="subtitle2" gutterBottom>Введите Y (-3 ... 3):</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    error={!!localErrors.y}
                    helperText={localErrors.y}
                    placeholder="-3 ... 3"
                />
            </Box>


            <Box>
                <Typography variant="subtitle2" gutterBottom>Введите R (1 ... 4):</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={rLocal}
                    onChange={handleRChange}

                    error={!!localErrors.r || !!globalRError}

                    helperText={localErrors.r || globalRError}
                    placeholder="1 ... 4"
                />
            </Box>

            <Button variant="contained" size="large" onClick={handleSubmit} sx={{ mt: 1 }}>
                Проверить
            </Button>
        </Paper>
    );
};

export default PointForm;