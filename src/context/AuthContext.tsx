'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number, description?: string, type?: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize and listen to Auth state changes
  useEffect(() => {
    const supabase = createClient();

    // 1. If Supabase is configured, use real auth state
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSupabaseUser(session.user);
        } else {
          loadLocalFallback();
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncSupabaseUser(session.user);
        } else {
          loadLocalFallback();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Fallback to localStorage state if env keys not yet bound
      loadLocalFallback();
      setIsLoading(false);
    }
  }, []);

  const syncSupabaseUser = async (authUser: any) => {
    const supabase = createClient();
    if (!supabase) return;

    // Fetch credits from public.users table
    const { data: profile } = await supabase
      .from('users')
      .select('credits, name, avatar')
      .eq('id', authUser.id)
      .single();

    const userData: User = {
      id: authUser.id,
      email: authUser.email || '',
      name: profile?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Rap Creator',
      avatar: profile?.avatar || authUser.user_metadata?.avatar_url || '/examples/friends.jpg',
      credits: profile?.credits ?? 10,
    };

    setUser(userData);
    localStorage.setItem('phototorap_user', JSON.stringify(userData));
  };

  const loadLocalFallback = () => {
    const stored = localStorage.getItem('phototorap_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(null);
      }
    } else {
      // Default initial guest user with 10 free credits for immediate trial
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
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    const supabase = createClient();
    if (supabase) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://phototorap.com';
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
    } else {
      // Local fallback simulation if keys missing
      const newUser: User = {
        id: 'usr_google_' + Math.random().toString(36).substring(7),
        email: 'google_user@gmail.com',
        name: 'Google Creator',
        avatar: '/examples/friends.jpg',
        credits: 20,
      };
      setUser(newUser);
      localStorage.setItem('phototorap_user', JSON.stringify(newUser));
      setIsAuthModalOpen(false);
    }
  };

  // Magic Link or Email Login
  const loginWithEmail = async (email: string) => {
    const supabase = createClient();
    if (supabase) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://phototorap.com';
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Check your email for the magic sign-in link!' };
    } else {
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
      return { success: true };
    }
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
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

    // Async sync with Supabase if online
    const supabase = createClient();
    if (supabase && user.id && !user.id.startsWith('usr_')) {
      supabase.rpc('deduct_credits', { p_user_id: user.id, p_amount: amount }).then();
    }

    return true;
  };

  const addCredits = (amount: number, description: string = 'Waffo Credit Top Up', type: string = 'purchase') => {
    if (!user) return;
    const updated = { ...user, credits: user.credits + amount };
    setUser(updated);
    localStorage.setItem('phototorap_user', JSON.stringify(updated));

    const supabase = createClient();
    if (supabase && user.id && !user.id.startsWith('usr_')) {
      // 1. 更新用户余额
      supabase
        .from('users')
        .update({ credits: updated.credits, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .then();

      // 2. 写入积分交易明细流水表 (credit_transactions)
      supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount,
          type,
          description,
          ref_id: 'topup_' + Date.now(),
        })
        .then();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
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
