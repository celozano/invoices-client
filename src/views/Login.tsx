import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'components/Button';
import { useAuth } from 'contexts/AuthContext';
import { getAuthErrorMessage } from 'utils';

export const Login = () => {
  const { isLoggedIn, login } = useAuth();

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      toast.error(getAuthErrorMessage(error.code));
    }

    setIsLoading(false);
  };

  return (
    <div className='flex h-screen items-center justify-center py-12 px-6'>
      <div className='w-full max-w-md'>
        <div className='rounded-lg border border-gray-300 bg-white py-8 px-10 shadow-md'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
            <div>
              <Button
                className='flex w-full justify-center'
                disabled={isLoading}
                type='submit'
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
