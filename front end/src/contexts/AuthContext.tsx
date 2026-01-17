import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authAPI.login(email, password);
      const body = res.data;
      // body: { success: boolean, message, data: { user?, token? } }
      if (body && body.success && body.data) {
        const tokenStr = body.data.token;
        const userObj = body.data.user;
        if (tokenStr) {
          localStorage.setItem('token', tokenStr);
          setToken(tokenStr);
        }
        if (userObj) {
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
        }
        // Notify other contexts to refresh data
        try { window.dispatchEvent(new Event('auth-change')); } catch(e) {}
      } else {
        throw new Error(body?.message || 'Login failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const res = await authAPI.register({ email, password, firstName, lastName });
      const body = res.data;
      if (body && body.success && body.data) {
        // backend returns data with user fields and possibly token
        const data = body.data;
        const tokenStr = data.token || data.token?.toString();
        // build user object
        const userObj = {
          id: data.id?.toString() || data.user?.id?.toString() || Date.now().toString(),
          email: data.email || data.user?.email || email,
          firstName: data.firstName || data.user?.firstName || firstName,
          lastName: data.lastName || data.user?.lastName || lastName,
        };

        if (tokenStr) {
          localStorage.setItem('token', tokenStr);
          setToken(tokenStr);
        }
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        // Notify other contexts to refresh data
        try { window.dispatchEvent(new Event('auth-change')); } catch(e) {}
      } else {
        throw new Error(body?.message || 'Registration failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    try { window.dispatchEvent(new Event('auth-change')); } catch(e) {}
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!token,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
