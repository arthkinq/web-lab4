import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const BackgroundBlobs = ({ darkMode }) => {
    const palette = {
        dark: {
            blob1: 'radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, rgba(76, 29, 149, 0) 70%)', // Deep Violet
            blob2: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(8, 145, 178, 0) 70%)',  // Electric Cyan
            blob3: 'radial-gradient(circle, rgba(219, 39, 119, 0.8) 0%, rgba(190, 24, 93, 0) 70%)',  // Hot Pink
        },
        light: {
            blob1: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, rgba(221, 214, 254, 0) 70%)', // Soft Purple
            blob2: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(207, 250, 254, 0) 70%)',  // Soft Cyan
            blob3: 'radial-gradient(circle, rgba(244, 114, 182, 0.6) 0%, rgba(252, 231, 243, 0) 70%)',  // Soft Pink
        }
    };

    const theme = darkMode ? palette.dark : palette.light;

    const transitionSettings = {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
    };

    return (
        <Box sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
            background: darkMode ? 'linear-gradient(to bottom, #0f172a, #1e1b4b)' : '#f8fafc'
        }}>

            <motion.div
                animate={{
                    x: ["-20%", "20%", "-10%"],
                    y: ["-20%", "10%", "-20%"],
                    scale: [1, 1.4, 1],
                    rotate: [0, 45, -45, 0],
                }}
                transition={{ ...transitionSettings, duration: 35 }}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '70vw',
                    height: '70vw',
                    background: theme.blob1,
                    filter: 'blur(90px)',
                    opacity: darkMode ? 0.6 : 0.8,
                    mixBlendMode: darkMode ? 'screen' : 'multiply',
                    willChange: 'transform'
                }}
            />

            <motion.div
                animate={{
                    x: ["20%", "-20%", "10%"],
                    y: ["10%", "-20%", "20%"],
                    scale: [1, 1.2, 0.9],
                    rotate: [0, -60, 30, 0],
                }}
                transition={{ ...transitionSettings, duration: 40 }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '-20%',
                    width: '60vw',
                    height: '60vw',
                    background: theme.blob2,
                    filter: 'blur(100px)',
                    opacity: darkMode ? 0.5 : 0.7,
                    mixBlendMode: darkMode ? 'hard-light' : 'multiply',
                    willChange: 'transform'
                }}
            />

            <motion.div
                animate={{
                    x: ["-10%", "30%", "-20%"],
                    y: ["20%", "-10%", "30%"],
                    scale: [0.8, 1.1, 0.9],
                }}
                transition={{ ...transitionSettings, duration: 30 }}
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '20%',
                    width: '50vw',
                    height: '50vw',
                    background: theme.blob3,
                    filter: 'blur(110px)',
                    opacity: darkMode ? 0.4 : 0.6,
                    mixBlendMode: darkMode ? 'screen' : 'multiply',
                    willChange: 'transform'
                }}
            />

            <motion.div
                animate={{
                    x: ["50%", "-50%"],
                    y: ["-50%", "50%"],
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                style={{
                    position: 'absolute',
                    top: '40%',
                    left: '40%',
                    width: '30vw',
                    height: '30vw',
                    background: darkMode
                        ? 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(0,0,0,0) 70%)'
                        : 'radial-gradient(circle, rgba(196, 181, 253, 0.6) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'overlay',
                    willChange: 'transform, opacity'
                }}
            />
        </Box>
    );
};

export default BackgroundBlobs;