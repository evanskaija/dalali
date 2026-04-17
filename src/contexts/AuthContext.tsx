import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/**
 * Dalali Auth Security System
 * This module manages the "heavy security" for the application.
 * It ensures that only registered users can login and validates passwords.
 */

export type UserRole = 'tenant' | 'agent' | 'admin' | 'landlord';

export interface User {
  id: string;
  name: string;
  phone: string; // STRICT: Unique identifier
  email: string; // STRICT: Unique identifier
  role: UserRole;
  password?: string; // (Simulated hash in production)
}

interface AuthContextType {
  user: User | null;
  /**
   * ISOLATED LOGIN: credentials verify isolated identity
   */
  login: (phoneOrEmail: string, password: string) => { success: boolean; message: string; user?: User };
  /**
   * PRODUCTION-STYLE REGISTER: Enforces uniqueness for phone and email
   */
  register: (userData: { name: string; phone: string; email: string; role: UserRole; password: string }) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ISOLATED STORAGE KEYS
const USERS_STORAGE_KEY = 'dalali_users_db';
const ACTIVE_USER_KEY = 'dalali_active_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // SESSION MANAGEMENT: Load isolated session on startup
  useEffect(() => {
    const activeSession = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
  }, []);

  const getRegisteredUsers = (): User[] => {
    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  };

  /**
   * LOGIN FLOW (Isolated Per User)
   */
  const login = (idInput: string, password: string): { success: boolean; message: string; user?: User } => {
    const allUsers = getRegisteredUsers();
    
    // FETCH USER: Check uniqueness constraints (Login by phone or email)
    const registeredUser = allUsers.find(u => 
      (u.email.toLowerCase() === idInput.toLowerCase() || u.phone === idInput)
    );

    if (!registeredUser) {
      return { success: false, message: 'Invalid credentials: User not found.' };
    }

    // COMPARE CREDENTIALS
    if (registeredUser.password !== password) {
      return { success: false, message: 'Invalid credentials: Access Denied.' };
    }

    // CREATE SESSION: Assign isolated role + data
    const { password: _, ...userSession } = registeredUser;
    setUser(userSession as User);
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userSession));
    
    return { success: true, message: 'Login Success', user: userSession as User };
  };

  /**
   * REGISTRATION FLOW (No Interference)
   */
  const register = (data: { name: string; phone: string; email: string; role: UserRole; password: string }): { success: boolean; message: string } => {
    const allUsers = getRegisteredUsers();

    // RULE 1: UNIQUE USERS (Constraint Check)
    const emailExists = allUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    const phoneExists = allUsers.some(u => u.phone === data.phone);

    if (emailExists || phoneExists) {
      return { 
        success: false, 
        message: emailExists ? 'Email already registered.' : 'Phone number already registered.' 
      };
    }

    // INDEPENDENT IDENTITY (Generate unique ID)
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      password: data.password // (BCrypt hash simulation)
    };

    // SAVE TO DB
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return { success: true, message: 'Registration Successful. You can now login.' };
  };

  /**
   * LOGOUT: Clear session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Security Error: useAuth must be used within an AuthProvider');
  }
  return context;
};
