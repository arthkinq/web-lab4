import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CustomInput = ({ label, value, onChange, type = "text", icon, endAdornment, theme }) => (
    <TextField
        fullWidth
        variant="filled"
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        InputProps={{
            disableUnderline: true,
            startAdornment: (<InputAdornment position="start" sx={{ color: theme.iconColor }}>{icon}</InputAdornment>),
            endAdornment: endAdornment,
            sx: {
                borderRadius: '16px',
                bgcolor: theme.inputBg,
                border: '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: theme.inputHover },
                '&.Mui-focused': {
                    bgcolor: theme.bg === '#0f172a' ? '#334155' : '#fff',
                    borderColor: '#8b5cf6',
                    boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.1)'
                },
                fontWeight: 600,
                color: theme.text
            }
        }}
        InputLabelProps={{ sx: { color: theme.subText, fontWeight: 500 } }}
    />
);

export default CustomInput;