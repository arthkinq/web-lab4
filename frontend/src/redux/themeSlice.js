import { createSlice } from '@reduxjs/toolkit';

// Проверяем localStorage при загрузке: если там 'dark', то true, иначе false
const initialDarkMode = localStorage.getItem('theme') === 'dark';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkMode: initialDarkMode
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            // Сохраняем выбор пользователя навсегда
            localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        }
    }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;