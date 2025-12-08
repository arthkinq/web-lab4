import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';


const PrivateRoute = ({ children }) => {
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    return isAuth ? children : <Navigate to="/" replace />;
};


const AnonymousRoute = ({ children }) => {
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    return isAuth ? <Navigate to="/main" replace /> : children;
};

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AnonymousRoute>
                        <StartPage />
                    </AnonymousRoute>
                }
            />

            <Route
                path="/main"
                element={
                    <PrivateRoute>
                        <MainPage />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;