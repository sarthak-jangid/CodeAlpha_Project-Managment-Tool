import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { username: string; name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setUser(response.user ?? null);
  };

  const register = async (payload: { username: string; name: string; email: string; password: string }) => {
    const response = await registerUser(payload);
    setUser(response.user ?? null);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, checkAuth }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
