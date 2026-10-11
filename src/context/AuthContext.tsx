'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackSignUp, trackLogin } from '@/lib/analytics';

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
  setUserCredits: (credits: number) => void;
  refreshBalance: () => Promise<void>;
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

    // GA4：区分 sign_up（本浏览器首次见到该用户）与 login（回访）。
    // sessionStorage 防止同 tab 生命周期内重复 fire（刷新页面不会重复计数）；
    // localStorage 标记跨会话记住"已注册过"，从而把首次 vs 回访区分开。
    if (typeof window !== 'undefined') {
      const firedKey = 'pt_auth_event_fired';
      if (!sessionStorage.getItem(firedKey)) {
        sessionStorage.setItem(firedKey, '1');
        const knownKey = `pt_known_user_${authUser.id}`;
        const method =
          (authUser.app_metadata && authUser.app_metadata.provider) ||
          (authUser.identities && authUser.identities[0] && authUser.identities[0].provider) ||
          'unknown';
        if (!localStorage.getItem(knownKey)) {
          localStorage.setItem(knownKey, '1');
          trackSignUp({ method });
        } else {
          trackLogin({ method });
        }
      }
    }
  };

  const loadLocalFallback = () => {
    const stored = localStorage.getItem('phototorap_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 如果是历史遗留的虚拟 guest 用户 (usr_xxx)，清理掉，强制要求正式登录
        if (parsed?.id && !parsed.id.startsWith('usr_')) {
          setUser(parsed);
          return;
        }
      } catch (e) {
        // ignore parse error
      }
    }
    // 未登录访客严格保持为 null，不分配虚拟游客身份
    setUser(null);
    localStorage.removeItem('phototorap_user');
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

  const setUserCredits = (credits: number) => {
    if (!user) return;
    const updated = { ...user, credits };
    setUser(updated);
    localStorage.setItem('phototorap_user', JSON.stringify(updated));
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

  /**
   * 从服务端读回**自己**的真实余额。
   *
   * ⚠️ 客户端不再具备发放积分的能力。此前这里是 `addCredits(amount, ...)`，
   * 会把客户端传入的积分数 POST 到 /api/user/record-topup——那个接口无鉴权、
   * 也不校验支付，等于任何登录用户都能凭空造积分（甚至能指定任意 userId）。
   * 现在积分只能由已验签的支付 webhook（Waffo / Stripe）写入，
   * 前端在支付回跳后只做"刷新余额"，把 webhook 已写入的结果读回来。
   */
  const refreshBalance = async () => {
    if (!user?.id || user.id.startsWith('usr_')) return;
    try {
      const res = await fetch('/api/user/balance', { cache: 'no-store' });
      if (!res.ok) {
        console.warn('[refreshBalance] Non-OK response:', res.status);
        return;
      }
      const data = await res.json();
      if (typeof data.credits === 'number') {
        setUser((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, credits: data.credits };
          localStorage.setItem('phototorap_user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('[refreshBalance] Failed:', err);
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
        setUserCredits,
        refreshBalance,
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
