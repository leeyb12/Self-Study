import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

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

export const useAuth = () => useContext(AuthContext);