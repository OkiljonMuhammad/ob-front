import { createContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/authUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token && !isTokenExpired(token);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token && !isTokenExpired(token));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      return false;
    }
    return true;
  };

  const login = (token) => {
    if (!token) throw new Error('No token provided during login.');
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
