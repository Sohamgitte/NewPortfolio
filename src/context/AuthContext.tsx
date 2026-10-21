import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check admin table in PostgreSQL
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true; // Demo fallback

    try {
      const { data, error: queryError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (queryError || !data) {
        return false;
      }

      return data.role === 'admin' || data.role === 'super_admin';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (!isSupabaseConfigured) {
        // In unconfigured demo mode, check if temporary demo session exists
        const demoSession = localStorage.getItem('sohamlabs_demo_auth');
        if (demoSession === 'true' && mounted) {
          setUser({
            id: 'soham-admin-uid',
            email: 'sohamgitte125@gmail.com',
            app_metadata: {},
            user_metadata: { full_name: 'Soham Gitte' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
          setIsAdmin(true);
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (initialSession?.user && mounted) {
          setSession(initialSession);
          setUser(initialSession.user);
          const authorized = await checkAdminStatus(initialSession.user.id);
          setIsAdmin(authorized);
        }
      } catch (err) {
        if (mounted) {
          setError((err as AuthError).message || 'Authentication initialization failed');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }

      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          if (!mounted) return;

          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            const authorized = await checkAdminStatus(newSession.user.id);
            setIsAdmin(authorized);
          } else {
            setIsAdmin(false);
          }
          setIsLoading(false);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Admin credentials for local and offline CMS mode
        const normalizedEmail = email.trim().toLowerCase();
        const isSohamCreds = normalizedEmail === 'sohamgitte125@gmail.com' && password === 'Soham_gitte_2';
        const isLegacyDemo = normalizedEmail === 'admin@sohamlabs.com' && password === 'admin123';

        if (isSohamCreds || isLegacyDemo) {
          localStorage.setItem('sohamlabs_demo_auth', 'true');
          setUser({
            id: 'soham-admin-uid',
            email: 'sohamgitte125@gmail.com',
            app_metadata: {},
            user_metadata: { full_name: 'Soham Gitte' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
          setIsAdmin(true);
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          const msg = 'Invalid admin credentials. Please use your authorized email & password.';
          setError(msg);
          return { success: false, error: msg };
        }
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (data.user) {
        const authorized = await checkAdminStatus(data.user.id);
        if (!authorized) {
          await supabase.auth.signOut();
          const unauthorizedMsg = 'Access Denied: Your account is not authorized as an administrator. Please run the admin_bootstrap.sql query in Supabase.';
          setError(unauthorizedMsg);
          return { success: false, error: unauthorizedMsg };
        }

        setUser(data.user);
        setSession(data.session);
        setIsAdmin(true);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (err) {
      const msg = (err as Error).message || 'Unexpected login error';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('sohamlabs_demo_auth');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: true,
        error: 'Demo Mode: Password reset email simulated. Configure Supabase in .env to send real transactional emails.',
      };
    }

    try {
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetErr) {
        return { success: false, error: resetErr.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isConfigured: isSupabaseConfigured,
        error,
        login,
        logout,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
