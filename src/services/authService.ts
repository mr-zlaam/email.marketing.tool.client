import type { LoginCredentials, AuthResponse, User, JWTPayload } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/loginUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Extract user data from JWT token since getCurrentUser has backend issues
      const payload = this.decodeToken(data.data.accessToken);
      if (!payload) {
        throw new Error('Invalid token received');
      }

      const user: User = {
        uid: payload.uid,
        email: credentials.email,
        role: payload.role as 'ADMIN' | 'USER',
        isVerified: payload.isVerified,
      };

      return {
        user,
        tokens: {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        },
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error occurred');
    }
  },

  async getCurrentUser(token?: string): Promise<User> {
    const accessToken = token || this.getStoredToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/getCurrentUser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user data');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to get user data');
      }

      return {
        uid: data.data.uid,
        username: data.data.username,
        fullName: data.data.fullName,
        email: data.data.email,
        role: data.data.role,
        isVerified: data.data.isVerified,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get user data');
    }
  },

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/refreshAccessToken`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Store the new tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);

      return data.data.accessToken;
    } catch (error) {
      // If refresh fails, logout the user
      this.logout();
      throw error instanceof Error ? error : new Error('Token refresh failed');
    }
  },

  async logout(): Promise<void> {
    const accessToken = this.getStoredToken();

    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/user/logoutUser`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  decodeToken(token: string): JWTPayload | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as JWTPayload;
    } catch {
      return null;
    }
  },

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  storeAuth(user: User, tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  isTokenExpiringSoon(token: string, bufferMinutes = 5): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = bufferMinutes * 60;
      return payload.exp < (currentTime + bufferTime);
    } catch {
      return true;
    }
  },

  async ensureValidToken(): Promise<string | null> {
    const accessToken = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    // If access token is expired or expiring soon, refresh it
    if (this.isTokenExpired(accessToken) || this.isTokenExpiringSoon(accessToken)) {
      try {
        const newAccessToken = await this.refreshToken(refreshToken);
        return newAccessToken;
      } catch {
        // If refresh fails, logout the user
        this.logout();
        return null;
      }
    }

    return accessToken;
  },

  // Enhanced API request helper with automatic token refresh
  async makeAuthenticatedRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = await this.ensureValidToken();

    if (!token) {
      throw new Error('No valid authentication token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  },
};