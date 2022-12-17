import { useContext, createContext, useEffect, useState } from 'react';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  User as FirebaseUser,
} from 'firebase/auth';

import { auth } from '../firebase';

interface Context {
  currentUser: FirebaseUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Context | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser: user,
    isLoggedIn: user !== null,
    login: (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    signup: (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
