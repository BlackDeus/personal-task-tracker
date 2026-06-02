import { apiRequest } from './client';
import type { AuthResponse } from '../types/auth';
import type { User } from '../types/auth';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register(payload: RegisterPayload) {
    return apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    return apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  me() {
    return apiRequest<{ user: User }>('/api/auth/me');
  },
};
