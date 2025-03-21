import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
}

interface LoginCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Validate token with the server
          const response = await axios.get('/api/auth/validate-token', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.status === 200) {
            setIsAuthenticated(true);
            // If you have user data in the response
            if (response.data.user) {
              setUser(response.data.user);
            }
          }
        } catch (error) {
          // If token validation fails, try to refresh the token
          try {
            const refreshResponse = await axios.get('/api/auth/refresh');
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            setIsAuthenticated(true);
          } catch (refreshError) {
            // If refresh fails, clear everything
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      
      localStorage.setItem('accessToken', response.data.accessToken);
      setIsAuthenticated(true);
      
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
      {!loading && children}
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