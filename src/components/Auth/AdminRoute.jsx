import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, validateToken, isAdmin } = useContext(AuthContext);

  if (!isAuthenticated || !validateToken() || !isAdmin() ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
