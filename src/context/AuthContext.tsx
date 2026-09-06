'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from './ToastContext';
import { insforge } from '@/lib/insforge';
import { clearGuestCartStorage, clearAllLegacyStorage } from '@/services/cart';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; message?: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; message?: string }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationCode: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();

  const refreshSession = useCallback(async () => {
    try {
      const { data: authData, error: authError } = await insforge.auth.getCurrentUser();

      if (!authError && authData?.user) {
        const authUser = authData.user;
        const profileObj = authUser.profile as any;
        let fullName = profileObj?.name || profileObj?.full_name || authUser.email?.split('@')[0] || 'Member';
        let phone = '';
        let avatarUrl = profileObj?.avatar_url || profileObj?.picture || undefined;

        try {
          const { data: profile } = await insforge.database
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (profile) {
            fullName = profile.full_name || fullName;
            phone = profile.phone || phone;
          }
        } catch (pe) {
          console.warn('Profile fetch warning:', pe);
        }

        const loggedInUser: User = {
          id: authUser.id,
          name: fullName,
          email: authUser.email || '',
          phone,
          avatar_url: avatarUrl,
          emailVerified: !!authUser.emailVerified,
          addresses: [],
        };

        setUser(loggedInUser);
        localStorage.setItem('patanjali_user', JSON.stringify(loggedInUser));
        return;
      }

      // No active InsForge session
      setUser(null);
      localStorage.removeItem('patanjali_user');
    } catch (e) {
      console.error('Failed to initialize session:', e);
      setUser(null);
      localStorage.removeItem('patanjali_user');
    }
  }, []);

  // Initialize session on mount via InsForge
  useEffect(() => {
    async function initSession() {
      await refreshSession();
      setIsInitialized(true);
    }

    initSession();
  }, []);

  const login = async (
    emailOrPhone: string,
    password = ''
  ): Promise<{ success: boolean; requiresVerification?: boolean; email?: string; message?: string }> => {
    setIsLoading(true);
    const cleanInput = emailOrPhone.trim();

    if (!cleanInput) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email or 10-digit mobile number.' };
    }

    if (!password) {
      setIsLoading(false);
      return { success: false, message: 'Password is required.' };
    }

    const emailToUse = cleanInput.includes('@')
      ? cleanInput
      : `${cleanInput.replace(/\D/g, '')}@patanjali-member.in`;

    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        setIsLoading(false);
        const errMsg = error.message?.toLowerCase() || '';
        if (errMsg.includes('verify') || errMsg.includes('verification') || errMsg.includes('unconfirmed')) {
          return {
            success: false,
            requiresVerification: true,
            email: emailToUse,
            message: 'Your email address is not verified yet. Please enter the verification code sent to your email.',
          };
        }
        if (error.statusCode === 401 || errMsg.includes('invalid') || errMsg.includes('credential')) {
          return { success: false, message: 'Incorrect email or password. Please try again.' };
        }
        return { success: false, message: error.message || 'Authentication failed.' };
      }

      if (data?.user) {
        const authUser = data.user;

        if (!authUser.emailVerified) {
          setIsLoading(false);
          return {
            success: false,
            requiresVerification: true,
            email: emailToUse,
            message: 'Please verify your email address to continue.',
          };
        }

        let fullName = (authUser.profile as any)?.name || emailToUse.split('@')[0];
        let phone = '';

        try {
          const { data: profile } = await insforge.database
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (profile) {
            fullName = profile.full_name || fullName;
            phone = profile.phone || phone;
          }
        } catch (pe) {
          console.warn('Profile fetch warning:', pe);
        }

        const authenticatedUser: User = {
          id: authUser.id,
          name: fullName,
          email: authUser.email || emailToUse,
          phone,
          emailVerified: true,
          addresses: [],
        };

        setUser(authenticatedUser);
        localStorage.setItem('patanjali_user', JSON.stringify(authenticatedUser));
        setIsLoading(false);
        showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, message: 'Authentication failed. Please check credentials.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Network error during sign in.' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; requiresVerification?: boolean; email?: string; message?: string }> => {
    setIsLoading(true);

    if (!data.name || data.name.trim().length < 2) {
      setIsLoading(false);
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!data.email || !data.email.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!data.phone || data.phone.replace(/\D/g, '').length !== 10) {
      setIsLoading(false);
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!data.password || data.password.length < 6) {
      setIsLoading(false);
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    try {
      const { data: signUpData, error: signUpError } = await insforge.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
      });

      if (signUpError) {
        setIsLoading(false);
        const msg = signUpError.message?.toLowerCase() || '';
        if (msg.includes('already exists') || msg.includes('registered') || msg.includes('unique')) {
          return { success: false, message: 'An account with this email already exists. Please log in.' };
        }
        return { success: false, message: signUpError.message || 'Registration failed.' };
      }

      setIsLoading(false);
      showToast('Account created! A 6-digit verification code was sent to your email.', 'info');
      return {
        success: true,
        requiresVerification: true,
        email: data.email.trim(),
      };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Network error during registration.' };
    }
  };

  const signInWithGoogle = async (
    redirectTo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const target = redirectTo || '/shop';
        sessionStorage.setItem('auth_redirect', target);
        const redirectUri = `${window.location.origin}/auth/callback`;

        const { data, error } = await insforge.auth.signInWithOAuth('google', {
          redirectTo: redirectUri,
          additionalParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
          ...({
            queryParams: {
              prompt: 'select_account',
              access_type: 'offline',
            },
          } as any),
        });

        if (error) {
          setIsLoading(false);
          const errorMsg = error.message || 'Unable to connect to Google authentication.';
          showToast(errorMsg, 'error');
          return { success: false, error: errorMsg };
        }

        if (data?.url) {
          window.location.href = data.url;
        }
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Browser environment not available.' };
    } catch (e: any) {
      setIsLoading(false);
      const errorMsg = e?.message || 'Unexpected error during Google sign-in.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const verifyCode = async (
    email: string,
    code: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email: email.trim(),
        otp: code.trim(),
      });

      if (error) {
        setIsLoading(false);
        return {
          success: false,
          message: error.message || 'Invalid or expired verification code.',
        };
      }

      if (data?.user) {
        const authUser = data.user;

        // Upsert customer profile in InsForge if pending registration exists
        let fullName = (authUser.profile as any)?.name || authUser.email?.split('@')[0] || 'Member';
        let phone = '';

        if (typeof window !== 'undefined') {
          const pendingReg = sessionStorage.getItem('patanjali_pending_reg');
          if (pendingReg) {
            try {
              const parsed = JSON.parse(pendingReg);
              if (parsed.email === email) {
                fullName = parsed.name || fullName;
                phone = parsed.phone || phone;
              }
            } catch {}
          }
        }

        try {
          await insforge.database.from('profiles').upsert({
            user_id: authUser.id,
            full_name: fullName,
            phone: phone || null,
            email: authUser.email || email,
          });
          sessionStorage.removeItem('patanjali_pending_reg');
        } catch (pe) {
          console.warn('Profile upsert warning:', pe);
        }

        const verifiedUser: User = {
          id: authUser.id,
          name: fullName,
          email: authUser.email || email,
          phone,
          emailVerified: true,
          addresses: [],
        };

        setUser(verifiedUser);
        localStorage.setItem('patanjali_user', JSON.stringify(verifiedUser));
        setIsLoading(false);
        showToast('Account successfully verified! Welcome to Patanjali Ayurveda.', 'success');
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, message: 'Verification could not be confirmed. Please try again.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Failed to verify account.' };
    }
  };

  const resendVerificationCode = async (
    email: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({
        email: email.trim(),
      });

      if (error) {
        return { success: false, message: error.message || 'Failed to resend verification code.' };
      }

      showToast('A fresh 6-digit verification code has been dispatched to your email.', 'success');
      return { success: true, message: data?.message || 'Verification code sent.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error requesting verification code.' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await insforge.auth.signOut();
    } catch (e) {
      console.warn('InsForge sign-out error:', e);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('patanjali_user');
      clearGuestCartStorage();
      clearAllLegacyStorage();
      localStorage.removeItem('patanjali_wishlist_guest');
      localStorage.removeItem('patanjali_wishlist');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    setIsLoading(false);
    showToast('You have been safely signed out.', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('patanjali_user', JSON.stringify(updated));

    if (user.id) {
      try {
        await insforge.database
          .from('profiles')
          .update({
            full_name: updated.name,
            phone: updated.phone,
          })
          .eq('user_id', user.id);
      } catch (e) {
        console.warn('Failed to sync profile update to InsForge:', e);
      }
    }

    showToast('Profile updated successfully.', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!user.emailVerified,
        isVerified: !!user?.emailVerified,
        isLoading: isLoading || !isInitialized,
        login,
        register,
        signInWithGoogle,
        verifyCode,
        resendVerificationCode,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
