import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import type { AuthContextType, LoginCredentials, User } from '@/types/auth.types';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();

      if (storedUser && storedToken) {
        // Check if token is still valid
        if (!authService.isTokenExpired(storedToken)) {
          setUser(storedUser);
        } else {
          // Try to refresh the token
          try {
            const validToken = await authService.ensureValidToken();
            if (validToken) {
              setUser(storedUser);
            } else {
              // Clear invalid tokens
              authService.logout();
            }
          } catch {
            // Clear invalid tokens
            authService.logout();
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const authResponse = await authService.login(credentials);
    authService.storeAuth(authResponse.user, authResponse.tokens);
    setUser(authResponse.user);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      // Still log out locally even if server logout fails
      setUser(null);
      toast.warning('Logged out locally (server logout failed)');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };