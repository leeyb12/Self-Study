import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar             from './components/Navbar';
import PlayerPage         from './pages/PlayerPage';
import LoginPage          from './pages/LoginPage';
import BoardPage          from './pages/BoardPage';
import RegisterPage       from './pages/RegisterPage';
import AlbumLibraryPage   from './pages/AlbumLibraryPage';

function PrivateRoute({ children }) {
    const { isLoggedIn, authReady } = useAuth();
    if (!authReady) return null;
    return isLoggedIn ? children : <Navigate to="/login" />;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/"         element={
                    <PrivateRoute>
                        <PlayerPage />
                    </PrivateRoute>
                } />
                <Route path="/library"  element={
                    <PrivateRoute>
                        <AlbumLibraryPage />
                    </PrivateRoute>
                } />
                <Route path="/board"     element={<BoardPage />} />
                <Route path="*"         element={<Navigate to="/login" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
