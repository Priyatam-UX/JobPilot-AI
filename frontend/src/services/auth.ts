import { apiRequest } from './api';
import { User } from '../types';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const authService = {
  register: (data: any) => apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: any) => apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  oauthLogin: (provider: string, token: string) => apiRequest<TokenResponse>('/auth/oauth', {
    method: 'POST',
    body: JSON.stringify({ provider, token }),
  }),

  getMe: () => apiRequest<User>('/auth/me', {
    method: 'GET',
  }),
};
