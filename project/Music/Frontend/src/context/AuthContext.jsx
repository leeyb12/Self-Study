import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token,     setToken]     = useState(() => localStorage.getItem('token'));
    const [username,  setUsername]  = useState(() => localStorage.getItem('username') || '익명');
    const [authReady, setAuthReady] = useState(false);

    // 토큰 변경 시 axios 기본 헤더 동기화
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

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUsername('익명');
    }, []);

    // 401 응답 시 자동 로그아웃 (토큰 만료 등)
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            res => res,
            err => {
                if (err.response?.status === 401) {
                    logout();
                }
                return Promise.reject(err);
            }
        );
        return () => axios.interceptors.response.eject(interceptorId);
    }, [logout]);

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
