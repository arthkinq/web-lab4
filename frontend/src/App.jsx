import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';

/**
 * Защищенный маршрут (для /main).
 * Если пользователь НЕ авторизован -> редирект на / (логин).
 * Если авторизован -> показываем страницу.
 */
const PrivateRoute = ({ children }) => {
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    return isAuth ? children : <Navigate to="/" replace />;
};

/**
 * Анонимный маршрут (для /).
 * Если пользователь УЖЕ авторизован -> редирект на /main.
 * Если не авторизован -> показываем форму входа.
 */
const AnonymousRoute = ({ children }) => {
    const isAuth = useSelector((state) => state.auth.isAuthenticated);
    return isAuth ? <Navigate to="/main" replace /> : children;
};

function App() {
    return (
        <Routes>
            {/* Страница входа/регистрации (доступна только гостям) */}
            <Route
                path="/"
                element={
                    <AnonymousRoute>
                        <StartPage />
                    </AnonymousRoute>
                }
            />

            {/* Главная страница (доступна только авторизованным) */}
            <Route
                path="/main"
                element={
                    <PrivateRoute>
                        <MainPage />
                    </PrivateRoute>
                }
            />

            {/* Любой несуществующий маршрут перенаправляем на начало */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;