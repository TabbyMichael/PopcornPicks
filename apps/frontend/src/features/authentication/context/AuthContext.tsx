import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ApiError, authApi } from '@popcornpicks/api-client';
import type { AuthUser } from '@popcornpicks/types';

import { storage } from '@/core/storage';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [status, setStatus] = useState<AuthStatus>(() =>
    storage.getToken() ? 'loading' : 'anonymous',
  );

  // Bootstrap: if a token was persisted, validate it against the backend once.
  useEffect(() => {
    const saved = storage.getToken();
    if (!saved) {
      setStatus('anonymous');
      return;
    }
    let active = true;
    authApi
      .me(saved)
      .then(({ user: me }) => {
        if (!active) return;
        setUser(me);
        setToken(saved);
        setStatus('authenticated');
      })
      .catch((err: unknown) => {
        if (!active) return;
        // Token invalid/expired -> drop it and continue anonymous.
        if (err instanceof ApiError && err.status === 401) {
          storage.clearToken();
          setToken(null);
        }
        setStatus('anonymous');
      });
    return () => {
      active = false;
    };
  }, []);

  const adopt = useCallback((nextToken: string, nextUser: AuthUser) => {
    storage.setToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setStatus('authenticated');
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      adopt(res.token, res.user);
    },
    [adopt],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.register({ email, password });
      adopt(res.token, res.user);
    },
    [adopt],
  );

  const logout = useCallback(() => {
    storage.clearToken();
    setToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(
    () => ({ user, token, status, login, register, logout }),
    [user, token, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
