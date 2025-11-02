// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  points: number;
  level: number;
  provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE';
  role: 'USER' | 'ADMIN';
}

// Auth Types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// API Error
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

