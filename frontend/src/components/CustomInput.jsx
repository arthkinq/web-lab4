import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CustomInput = ({
                         label,
                         value,
                         onChange,
                         type = 'text',
                         icon,
                         endAdornment,
                         theme,
                         // Принимаем новые пропсы:
                         onKeyDown,
                         inputRef,
                         ...props // Остальные пропсы
                     }) => {
    return (
        <TextField
            label={label}
            type={type}
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}

            // Прокидываем обработчик клавиш
            onKeyDown={onKeyDown}

            // Прокидываем реф (для фокуса)
            inputRef={inputRef}

            InputProps={{
                startAdornment: icon && (
                    <InputAdornment position="start" sx={{ color: theme.iconColor }}>
                        {icon}
                    </InputAdornment>
                ),
                endAdornment: endAdornment,
                sx: {
                    borderRadius: '16px',
                    bgcolor: theme.inputBg,
                    color: theme.text,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        bgcolor: theme.inputHover
                    },
                    '&.Mui-focused': {
                        bgcolor: theme.inputBg,
                        boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
                    },
                    '& fieldset': { border: 'none' }, // Убираем стандартную рамку
                }
            }}
            InputLabelProps={{
                sx: { color: theme.subText, '&.Mui-focused': { color: '#6366f1' } }
            }}
            {...props}
        />
    );
};

export default CustomInput;