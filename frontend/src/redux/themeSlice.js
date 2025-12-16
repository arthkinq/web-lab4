import { createSlice } from '@reduxjs/toolkit';

const initialDarkMode = localStorage.getItem('theme') === 'dark';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkMode: initialDarkMode
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
        }
    }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;