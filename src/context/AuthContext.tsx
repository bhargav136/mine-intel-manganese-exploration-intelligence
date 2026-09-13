import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Chief Geologist' | 'Mine Planning Superintendent' | 'DGMS Safety Officer' | 'Field Geologist';
  department: string;
  avatar: string;
  lastLogin: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; role: any; department: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (user: AuthUser) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: AuthUser = {
  id: 'usr-001',
  name: 'Dr. Alok Sharma',
  email: 'dr.sharma@moil.in',
  role: 'Chief Geologist',
  department: 'Exploration & Remote Sensing, MOIL Head Office',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  lastLogin: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check saved session in localStorage
    try {
      const savedUser = localStorage.getItem('mine_intel_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default to logged-in user for seamless demo, but user can log out
        setUser(DEFAULT_USER);
        localStorage.setItem('mine_intel_auth_user', JSON.stringify(DEFAULT_USER));
      }
    } catch {
      setUser(DEFAULT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string = 'password123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      localStorage.setItem('mine_intel_auth_user', JSON.stringify(data.user));
      localStorage.setItem('mine_intel_auth_token', data.token);
      setIsLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during login' };
    }
  };

  const register = async (userData: { name: string; email: string; role: any; department: string; password?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      localStorage.setItem('mine_intel_auth_user', JSON.stringify(data.user));
      localStorage.setItem('mine_intel_auth_token', data.token);
      setIsLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mine_intel_auth_user');
    localStorage.removeItem('mine_intel_auth_token');
    setIsLoginModalOpen(true);
  };

  const switchUser = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('mine_intel_auth_user', JSON.stringify(newUser));
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        isLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
