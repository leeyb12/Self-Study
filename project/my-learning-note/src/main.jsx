import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles/main.css'; // 전역 스타일

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);