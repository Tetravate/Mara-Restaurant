import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'staff' | 'admin';

export interface UserSession {
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
  badge: string;
  loginTime: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loginAsGuest: (name?: string, phone?: string) => void;
  loginAsStaff: (passcode: string, staffName?: string) => boolean;
  loginAsAdmin: (passcode: string) => boolean;
  logout: () => void;
  currentRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_PASSCODES = ['1234', 'admin', 'mara2026', 'master'];
export const STAFF_PASSCODES = ['5678', 'staff', 'kitchen', 'service', ...ADMIN_PASSCODES];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('mara_auth_session');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mara_auth_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('mara_auth_session');
    }
  }, [user]);

  const loginAsGuest = (name = 'Guest Patron', phone = '') => {
    const session: UserSession = {
      role: 'guest',
      name: name.trim() || 'Guest Patron',
      phone: phone.trim(),
      badge: 'Patron',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUser(session);
  };

  const loginAsStaff = (passcode: string, staffName = 'Staff Member'): boolean => {
    const cleaned = passcode.trim().toLowerCase();
    if (STAFF_PASSCODES.includes(cleaned)) {
      const session: UserSession = {
        role: 'staff',
        name: staffName.trim() || 'Kitchen & Host Brigade',
        badge: 'Staff Operations',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setUser(session);
      return true;
    }
    return false;
  };

  const loginAsAdmin = (passcode: string): boolean => {
    const cleaned = passcode.trim().toLowerCase();
    if (ADMIN_PASSCODES.includes(cleaned)) {
      const session: UserSession = {
        role: 'admin',
        name: 'General Manager (Admin)',
        email: 'admin@mara-dining.com',
        badge: 'Executive Admin',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setUser(session);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mara_auth_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsGuest,
        loginAsStaff,
        loginAsAdmin,
        logout,
        currentRole: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
