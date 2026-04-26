import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar      from './components/Navbar';
import PlayerPage  from './pages/PlayerPage';
import LoginPage   from './pages/LoginPage';
import BoardPage   from './pages/BoardPage';
import RegisterPage  from './pages/RegisterPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/"      element={<PlayerPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/board" element={<BoardPage />} />
                    <Route path="*"      element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;