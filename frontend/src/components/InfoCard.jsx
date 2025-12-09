import React from 'react';
import { Paper, IconButton, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

// Иконки
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SchoolIcon from '@mui/icons-material/School';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import GitHubIcon from '@mui/icons-material/GitHub';

// Вспомогательный компонент строки (локальный)
const InfoItem = ({ label, value, icon, theme }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ p: 0.8, borderRadius: '10px', bgcolor: theme.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.cloneElement(icon, { fontSize: 'small' })}
        </Box>
        <Box>
            <Typography variant="caption" display="block" sx={{ color: theme.subText }} lineHeight={1}>{label}</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: theme.text }}>{value}</Typography>
        </Box>
    </Box>
);

const InfoCard = ({ onClose, theme }) => (
    <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
        elevation={4}
        sx={{
            p: 3, width: 280, borderRadius: '24px', position: 'relative',
            bgcolor: theme.cardBg, backdropFilter: 'blur(10px)', border: `1px solid ${theme.cardBorder}`
        }}
    >
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: theme.subText }}>
            <CloseRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: theme.text }}>О проекте</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <InfoItem label="Студент" value="Сланов Артур" icon={<AccountCircleRoundedIcon sx={{ color: '#6366f1' }} />} theme={theme} />
            <InfoItem label="Группа" value="P3222" icon={<SchoolIcon sx={{ color: '#ec4899' }} />} theme={theme} />
            <InfoItem label="Вариант" value="74899" icon={<KeyRoundedIcon sx={{ color: '#f59e0b' }} />} theme={theme} />
            <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.inputHover}` }}>
                <Typography variant="caption" display="block" sx={{ color: theme.subText }}>Технологии: React, Redux, Java EE.</Typography>
                <Button startIcon={<GitHubIcon />} size="small" href="#" target="_blank" sx={{ mt: 1, borderRadius: '8px', textTransform: 'none', color: theme.text }}>Исходный код</Button>
            </Box>
        </Box>
    </Paper>
);

export default InfoCard;