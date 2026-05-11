import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const initToken = () => {
        const isNewSession = !sessionStorage.getItem('session_active');
        if (isNewSession) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            sessionStorage.setItem('session_active', 'true');
        }
        return localStorage.getItem('token');
    };

    const [token,     setToken]     = useState(initToken);
    const [username,  setUsername]  = useState(localStorage.getItem('username') ?? '익명');
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
        sessionStorage.setItem('session_active', 'true');
        // axios 헤더 즉시 설정 — setToken 이전에 설정해야 fetchSongs가 토큰을 바로 사용
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUsername(id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        sessionStorage.removeItem('session_active');
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