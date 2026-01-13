import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const resendVerification = async (email) => {
    return await supabase.auth.resend({
      type: 'signup',
      email,
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, resendVerification, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
