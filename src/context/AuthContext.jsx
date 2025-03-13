import { createContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/authUtils';
import { jwtDecode } from 'jwt-decode';

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

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  const userId = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
    value={{ isAuthenticated, login, logout, validateToken, isAdmin, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const username = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.username;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export default AuthContext;
