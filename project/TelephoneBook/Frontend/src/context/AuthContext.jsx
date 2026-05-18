import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// 1. Provider 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => ({
    token:    localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  }));

  const saveAuth = ({ token, username }) => {
    localStorage.setItem('token',    token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser({ token: null, username: null });
  };

  const isLoggedIn = !!user?.token;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. 커스텀 훅 (에러 발생 시 아래 주석 참고)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};