
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleSignOut: (router: AppRouterInstance) => void;
  updateUser: (newDetails: Partial<User>) => void;
  signInUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true, 
    handleSignOut: () => {}, 
    updateUser: () => {},
    signInUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage to persist state
    const savedUser = localStorage.getItem('mockUser');
    const userDatabase = localStorage.getItem('userDatabase');
    
    if (!userDatabase) {
      const defaultUser: User & { password?: string } = {
        uid: 'user-default',
        email: 'user@example.com',
        displayName: 'Demo User',
        password: 'password123'
      };
      const defaultDb = { [defaultUser.email as string]: defaultUser };
      localStorage.setItem('userDatabase', JSON.stringify(defaultDb));
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleSignOut = (router: AppRouterInstance) => {
    localStorage.removeItem('mockUser');
    setUser(null);
    router.push('/');
  };
  
  const signInUser = (userToSignIn: User) => {
    setUser(userToSignIn);
    localStorage.setItem('mockUser', JSON.stringify(userToSignIn));
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...newDetails };
        setUser(updatedUser);
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  const value = { user, loading, handleSignOut, updateUser, signInUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function WithAuth(props: P) {
      const { user, loading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!loading && !user) {
          router.push('/login');
        }
      }, [user, loading, router]);


      if (loading || !user) {
        return null; // Or a loading spinner
      }
      
      return <Component {...props} />;
    };
}
