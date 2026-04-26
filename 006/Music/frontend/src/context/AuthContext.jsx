import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token,     setToken]     = useState(localStorage.getItem('token'));
    const [username,  setUsername]  = useState(localStorage.getItem('username') ?? '익명');
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
        setAuthReady(true);
    }, [token]); // ← token 추가

    const login = async (id, password) => {
        const res = await axios.post('/api/auth/login', { username: id, password });
        const newToken = res.data.token;
        localStorage.setItem('token',    newToken);
        localStorage.setItem('username', id);
        setToken(newToken);
        setUsername(id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
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