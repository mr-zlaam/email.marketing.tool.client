export type UserRole = 'ADMIN' | 'USER';

export interface User {
  uid: string;
  username?: string;
  fullName?: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JWTPayload {
  uid: string;
  OTP_TOKEN_VERSION: number;
  role: UserRole;
  isVerified: boolean;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateUserResponse {
  user: User;
  message: string;
}