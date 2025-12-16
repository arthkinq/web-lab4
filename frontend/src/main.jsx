import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { HashRouter } from 'react-router-dom'
import { setupAxiosInterceptors } from './api/axiosConfig';
import { logout } from './redux/authSlice';
import { clearLocalPoints } from './redux/pointsSlice';

setupAxiosInterceptors(store, { logout, clearLocalPoints });

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
)