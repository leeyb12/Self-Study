import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '');
if (apiBaseUrl) {
    axios.defaults.baseURL = apiBaseUrl;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
