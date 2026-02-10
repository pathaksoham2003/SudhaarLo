import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const ProtectedRoute = ({ children }) => {
  const { pathname, search } = useLocation();
  const { isLogged, isUserLogOut } = useAuthStore();

  if (!isLogged) {
    return isUserLogOut ? (
      <Navigate replace to="/login" />
    ) : (
      <Navigate replace to={`/login?redirect=${encodeURIComponent(pathname + search)}`} />
    );
  }

  return children;
};
export default ProtectedRoute;