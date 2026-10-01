'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('phototorap_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    } else {
      const defaultUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(7),
        email: 'creator@phototorap.com',
        name: 'Rap Creator',
        avatar: '/examples/friends.jpg',
        credits: 10,
      };
      setUser(defaultUser);
      localStorage.setItem('phototorap_user', JSON.stringify(defaultUser));
    }
  }, []);

  const login = (email: string) => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(7),
      email,
      name: email.split('@')[0],
      avatar: '/examples/friends.jpg',
      credits: 20,
    };
    setUser(newUser);
    localStorage.setItem('phototorap_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('phototorap_user');
  };

  const deductCredits = (amount: number) => {
    if (!user || user.credits < amount) {
      setIsAuthModalOpen(true);
      return false;
    }
    const updated = { ...user, credits: user.credits - amount };
    setUser(updated);
    localStorage.setItem('phototorap_user', JSON.stringify(updated));
    return true;
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updated = { ...user, credits: user.credits + amount };
    setUser(updated);
    localStorage.setItem('phototorap_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        deductCredits,
        addCredits,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
