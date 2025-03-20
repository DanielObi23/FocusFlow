import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface LoginCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      // Store the access token in localStorage or in a more secure way
      localStorage.setItem('accessToken', response.data.accessToken);
      
      // Set authenticated state
      setIsAuthenticated(true);
      
      // You might want to fetch user data here
      // const userData = await axios.get('/api/user/profile');
      // setUser(userData.data);
      
      // For now, let's just set a basic user object
      setUser({
        id: response.data.id || '1',
        username: response.data.username || 'User',
        email: credentials.email
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      
      // Clear token and user data
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};