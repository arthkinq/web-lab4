import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

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
            await api.delete('/points');
            return;
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
        rError: '',
        currentPage: 0,
        itemsPerPage: 7
    },
    reducers: {
        setR: (state, action) => {
            state.currentR = action.payload;
            state.rError = '';
        },
        setRError: (state, action) => {
            state.rError = action.payload;
        },
        clearLocalPoints: (state) => {
            state.items = [];
            state.rError = '';
            state.currentPage = 0;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 0;
        },
        socketAddPoint: (state, action) => {
            const exists = state.items.some(p => p.id === action.payload.id);
            if (!exists) state.items.unshift(action.payload);
        },
        socketClearPoints: (state, action) => {
            const usernameToClear = action.payload;
            state.items = state.items.filter(p => p.user?.username !== usernameToClear);
            state.currentPage = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(addPoint.fulfilled, (state, action) => {
                const exists = state.items.some(p => p.id === action.payload.id);
                if (!exists) {
                    state.items.unshift(action.payload);
                }
                state.currentPage = 0;
            })
            .addCase(clearTable.fulfilled, (state) => {
                state.items = [];
                state.currentPage = 0;
            });
    }
});

export const {
    setR, clearLocalPoints, setRError, setCurrentPage, setItemsPerPage,
    socketAddPoint, socketClearPoints
} = pointsSlice.actions;
export default pointsSlice.reducer;