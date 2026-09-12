import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

const GUEST_USER = {
  id: 'guest',
  email: 'guest@pressurechess.com',
  username: 'Guest Grandmaster',
  elo_rating: 1200,
  daily_streak: 1,
  isGuest: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage first
    const savedGuest = localStorage.getItem('pressurechess_guest');
    if (savedGuest) {
      setUser(JSON.parse(savedGuest));
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      // Supabase persistent session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email.split('@')[0],
            isGuest: false
          });
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email.split('@')[0],
            isGuest: false
          });
        } else if (!localStorage.getItem('pressurechess_guest')) {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Default to guest session for smooth zero-config onboarding
      const devUser = localStorage.getItem('pressurechess_dev_user');
      if (devUser) {
        setUser(JSON.parse(devUser));
      } else {
        setUser(GUEST_USER);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      localStorage.removeItem('pressurechess_guest');
      return data;
    } else {
      // Mock / Offline login
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username: email.split('@')[0],
        elo_rating: 1250,
        daily_streak: 2,
        isGuest: false
      };
      setUser(mockUser);
      localStorage.setItem('pressurechess_dev_user', JSON.stringify(mockUser));
      localStorage.removeItem('pressurechess_guest');
      return { user: mockUser };
    }
  };

  const signup = async (email, password, username) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      if (error) throw error;
      return data;
    } else {
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username: username || email.split('@')[0],
        elo_rating: 1200,
        daily_streak: 1,
        isGuest: false
      };
      setUser(mockUser);
      localStorage.setItem('pressurechess_dev_user', JSON.stringify(mockUser));
      localStorage.removeItem('pressurechess_guest');
      return { user: mockUser };
    }
  };

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    localStorage.setItem('pressurechess_guest', JSON.stringify(GUEST_USER));
    localStorage.removeItem('pressurechess_dev_user');
  };

  const forgotPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('pressurechess_guest');
    localStorage.removeItem('pressurechess_dev_user');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isGuest: user?.isGuest ?? false,
      login,
      signup,
      loginAsGuest,
      logout,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
