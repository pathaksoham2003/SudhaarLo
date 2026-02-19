import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { pathname, search } = useLocation();
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');

  if (!token || role !== 'ADMIN') {
    return <Navigate replace to={`/login?redirect=${encodeURIComponent(pathname + search)}`} />;
  }

  return children;
};
export default ProtectedRoute;