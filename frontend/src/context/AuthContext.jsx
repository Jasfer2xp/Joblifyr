import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  fetchCurrentUser,
  getAccessToken,
  getStoredUser,
  loginUser,
  logoutUser,
  persistSession,
  registerUser,
  verifyRegistration,
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(!!getAccessToken());

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      try {
        const current = await fetchCurrentUser();
        if (!cancelled) setUser(current);
      } catch {
        if (!cancelled) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    return registerUser(payload);
  }, []);

  const verify = useCallback(async (email, verification_code) => {
    const data = await verifyRegistration(email, verification_code);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const setSession = useCallback((sessionUser, tokens) => {
    persistSession({ user: sessionUser, tokens });
    setUser(sessionUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user && !!getAccessToken(),
      login,
      register,
      verify,
      logout,
      setSession,
      refreshUser: async () => {
        const current = await fetchCurrentUser();
        setUser(current);
        return current;
      },
    }),
    [user, loading, login, register, verify, logout, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
