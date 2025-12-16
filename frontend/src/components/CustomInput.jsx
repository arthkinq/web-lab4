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
                         onKeyDown,
                         inputRef,
                         ...props
                     }) => {
    return (
        <TextField
            label={label}
            type={type}
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}

            onKeyDown={onKeyDown}

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
                    '& fieldset': { border: 'none' },
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