import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // for refresh_token cookie
});

// Add interceptor to add bearer token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  hmac_secret?: string;
  website?: string;
  webhook_url?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  website?: string;
  webhook_url?: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('access_token');
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  }
};

export default authService;
