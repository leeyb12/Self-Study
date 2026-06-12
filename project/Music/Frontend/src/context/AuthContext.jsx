import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const initToken = () => {
        // 새로고침 또는 새 탭 → 항상 토큰 초기화
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return null;
    };

    const [token,     setToken]     = useState(initToken);
    const [username,  setUsername]  = useState('익명');
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        setAuthReady(true);
    }, [token]);

    const login = async (id, password) => {
        const res = await axios.post('/api/auth/login', { username: id, password });
        const newToken = res.data.token;
        localStorage.setItem('token',    newToken);
        localStorage.setItem('username', id);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUsername(id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUsername('익명');
    };

    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            isLoggedIn: !!token,
            username,
            authReady,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);