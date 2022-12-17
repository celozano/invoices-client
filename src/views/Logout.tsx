import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { useAuth } from 'contexts/AuthContext';

export const Logout = () => {
  const { logout } = useAuth();
  const client = useApolloClient();
  const nagivate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      client.clearStore();
      nagivate('/login');
    });
  }, []);

  return null;
};
