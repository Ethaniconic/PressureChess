import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

const GUEST_USER = {
  id: 'guest',
  email: 'guest@pressurechess.com',
  username: 'Guest Tactician',
  elo_rating: 400,
  daily_streak: 1,
  isGuest: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuth() {
      try {
        const storedGuest = await AsyncStorage.getItem('pressurechess_guest');
        if (storedGuest) {
          setUser(JSON.parse(storedGuest));
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || session.user.email.split('@')[0],
              isGuest: false
            });
          }
        } else {
          const devUser = await AsyncStorage.getItem('pressurechess_dev_user');
          if (devUser) {
            setUser(JSON.parse(devUser));
          } else {
            setUser(GUEST_USER);
          }
        }
      } catch (e) {
        setUser(GUEST_USER);
      } finally {
        setLoading(false);
      }
    }

    loadAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username || session.user.email.split('@')[0],
            isGuest: false
          });
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await AsyncStorage.removeItem('pressurechess_guest');
      return data;
    } else {
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username: email.split('@')[0],
        elo_rating: 400,
        daily_streak: 2,
        isGuest: false
      };
      setUser(mockUser);
      await AsyncStorage.setItem('pressurechess_dev_user', JSON.stringify(mockUser));
      await AsyncStorage.removeItem('pressurechess_guest');
      return { user: mockUser };
    }
  };

  const signup = async (email, password, username) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) throw error;
      return data;
    } else {
      const mockUser = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        username: username || email.split('@')[0],
        elo_rating: 400,
        daily_streak: 1,
        isGuest: false
      };
      setUser(mockUser);
      await AsyncStorage.setItem('pressurechess_dev_user', JSON.stringify(mockUser));
      await AsyncStorage.removeItem('pressurechess_guest');
      return { user: mockUser };
    }
  };

  const loginAsGuest = async () => {
    setUser(GUEST_USER);
    await AsyncStorage.setItem('pressurechess_guest', JSON.stringify(GUEST_USER));
    await AsyncStorage.removeItem('pressurechess_dev_user');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    await AsyncStorage.removeItem('pressurechess_guest');
    await AsyncStorage.removeItem('pressurechess_dev_user');
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
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
