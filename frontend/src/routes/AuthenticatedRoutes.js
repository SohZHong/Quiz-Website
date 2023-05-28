import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

function AuthenticatedRoutes({component: Component, accessCondition=true}) {
  const { isAuthenticated } = useAuth();

  return (isAuthenticated && accessCondition) ? (
    Component
  ) : (
    <Navigate to="/login" />
  );
}

export default AuthenticatedRoutes;
