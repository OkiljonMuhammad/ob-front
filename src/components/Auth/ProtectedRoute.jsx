import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, validateToken, isAdmin } = useContext(AuthContext);

  if (!isAuthenticated || !validateToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
