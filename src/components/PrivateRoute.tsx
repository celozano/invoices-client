import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from 'contexts/AuthContext';

export const PrivateRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to={'/login'} />;
};
