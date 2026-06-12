import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import App from './App';
 
const theme = createTheme({
  palette: {
    primary:    { main: '#6366f1' },
    secondary:  { main: '#f59e0b' },
    background: { default: '#f1f5f9' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" },
});
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
