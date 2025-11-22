import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { mockAPI } from '../utils/mockAPI';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = async () => {
    const storedUser = localStorage.getItem('sav_user');
    if (storedUser) {
      setState(prev => ({ ...prev, user: JSON.parse(storedUser), isAuthenticated: true, isLoading: false }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user } = await mockAPI.auth.login(email);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('sav_user');
    localStorage.removeItem('sav_goals');
    localStorage.removeItem('sav_transactions');
    localStorage.removeItem('sav_invitation');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateUser = async (updates: Partial<User>) => {
    const updatedUser = await mockAPI.auth.updateUser(updates);
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};