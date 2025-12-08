import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, AppBar, Toolbar, Typography } from '@mui/material';


import { fetchPoints, clearLocalPoints } from '../redux/pointsSlice';
import { logout } from '../redux/authSlice';


import Graph from '../components/Graph';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';

const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);


    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearLocalPoints());
        navigate('/');
    };

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            {/* Верхняя панель (Header) */}
            <AppBar position="static" sx={{ mb: 2 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Web Lab 4
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        ВЫХОД
                    </Button>
                </Toolbar>
            </AppBar>


            <Box sx={{
                display: 'grid',
                gap: '20px',
                padding: '16px',
                margin: '0 auto',
                width: '100%',
                maxWidth: '1600px',
                boxSizing: 'border-box',
                alignItems: 'start',


                gridTemplateColumns: 'minmax(0, 1fr)',
                gridTemplateAreas: `
                    "graph"
                    "form"
                    "table"
                `,
                justifyItems: 'center',


                '@media (min-width: 827px)': {
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateAreas: `
                        "graph form"
                        "table table"
                    `,
                    justifyItems: 'stretch',
                },


                '@media (min-width: 1225px)': {
                    gridTemplateColumns: 'auto 400px 1fr',
                    gridTemplateAreas: `
                        "graph form table"
                    `,
                    justifyItems: 'start',
                }
            }}>

                <Box sx={{
                    gridArea: 'graph',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    '@media (min-width: 1225px)': { justifyContent: 'flex-start' }
                }}>
                    <Graph />
                </Box>

                {/* Область ФОРМЫ */}
                <Box sx={{
                    gridArea: 'form',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <PointForm />
                </Box>


                <Box sx={{
                    gridArea: 'table',
                    width: '100%',
                    overflowX: 'hidden'
                }}>
                    <ResultsTable />
                </Box>

            </Box>
        </Box>
    );
};

export default MainPage;