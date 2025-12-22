import {IconButton, Tooltip} from '@mui/material';
import { AnimatePresence} from 'framer-motion';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import {toggleTheme} from '../redux/themeSlice';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';


const ThemeToggle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useSelector((state) => state.theme.darkMode);
    const theme = {
        bg: darkMode ? '#0f172a' : '#f8fafc',
        glass: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        text: darkMode ? '#f1f5f9' : '#334155',
        subText: darkMode ? '#94a3b8' : '#64748b',
    };
return (
<Tooltip title="Сменить тему">
    <IconButton
        onClick={() => dispatch(toggleTheme())}
        sx={{
            color: theme.subText,
            width: 44, height: 44,
            borderRadius: '50%',
            overflow: 'hidden',
            '&:hover': {bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
        }}
    >
        <AnimatePresence mode='wait' initial={false}>
            <motion.div
                key={darkMode ? 'dark' : 'light'}
                initial={{y: -20, opacity: 0, rotate: -45}}
                animate={{y: 0, opacity: 1, rotate: 0}}
                exit={{y: 20, opacity: 0, rotate: 45}}
                transition={{duration: 0.2}}
                style={{display: 'flex'}}
            >
                {darkMode ? <DarkModeRoundedIcon/> : <LightModeRoundedIcon/>}
            </motion.div>
        </AnimatePresence>
    </IconButton>
</Tooltip>)}

export default ThemeToggle;