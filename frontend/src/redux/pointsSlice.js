import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// Асинхронное действие: Получить точки
export const fetchPoints = createAsyncThunk(
    'points/fetchPoints',
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get('/points');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка загрузки');
        }
    }
);

// Асинхронное действие: Добавить точку
export const addPoint = createAsyncThunk(
    'points/addPoint',
    async (pointData, {rejectWithValue}) => {
        try {
            const response = await api.post('/points', pointData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка добавления');
        }
    }
);

export const clearTable = createAsyncThunk(
    'points/clearTable',
    async (_, { rejectWithValue }) => {
        try {
            // Отправляем DELETE запрос на сервер
            await api.delete('/points');
            return; // Успех
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Ошибка очистки');
        }
    }
);
const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        currentR: 1,
        rError: '' // <--- НОВОЕ ПОЛЕ: для хранения ошибки R извне
    },
    reducers: {
        setR: (state, action) => {
            state.currentR = action.payload;
            state.rError = ''; // Если R изменили успешно, убираем ошибку
        },
        setRError: (state, action) => { // <--- НОВЫЙ ЭКШН
            state.rError = action.payload;
        },
        clearLocalPoints: (state) => {
            state.items = [];
            state.rError = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Загрузка
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            // Добавление
            .addCase(addPoint.fulfilled, (state, action) => {
                // Добавляем новую точку в начало списка
                state.items.unshift(action.payload);
            })
            .addCase(clearTable.fulfilled, (state) => {
                state.items = []; // Очищаем массив в Redux после ответа сервера
            });
    }
});

export const {setR, clearLocalPoints, setRError} = pointsSlice.actions;
export default pointsSlice.reducer;