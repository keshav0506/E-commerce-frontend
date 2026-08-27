import { apiFetch } from './api';
import type { UserProfile, UserAddress } from '../context/AuthContext';

export interface LoginResponse {
  token?: string;
  jwt?: string;
  accessToken?: string;
  user?: any;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  roles?: string[];
  addresses?: UserAddress[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login user (POST /api/auth/login)
 */
export async function loginApi(credentials: LoginRequest): Promise<{ token: string; user: UserProfile }> {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const token = data.token || data.jwt || data.accessToken || '';
  if (token) {
    localStorage.setItem('token', token);
  }

  const rawUser = data.user || data;
  const nameParts = (rawUser.name || credentials.email.split('@')[0]).split(' ');
  const firstName = rawUser.firstName || nameParts[0] || 'User';
  const lastName = rawUser.lastName || nameParts.slice(1).join(' ') || '';

  const role = rawUser.role || (data as any).role || (Array.isArray((data as any).roles) ? (data as any).roles[0] : 'CUSTOMER');

  const user: UserProfile = {
    id: String(rawUser.id || `usr-${Date.now()}`),
    firstName,
    lastName,
    name: rawUser.name || `${firstName} ${lastName}`.trim(),
    email: rawUser.email || credentials.email,
    phone: rawUser.phone || '',
    role: String(role).toUpperCase(),
    addresses: rawUser.addresses || [],
    preferences: rawUser.preferences || {
      emailNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
    },
  };

  return { token, user };
}

/**
 * Register user (POST /api/auth/register)
 */
export async function registerApi(userData: RegisterRequest): Promise<{ token: string; user: UserProfile }> {
  const data = await apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const token = data.token || data.jwt || data.accessToken || '';
  if (token) {
    localStorage.setItem('token', token);
  }

  const rawUser = data.user || data;
  const nameParts = (userData.name || '').trim().split(' ');
  const firstName = rawUser.firstName || nameParts[0] || 'User';
  const lastName = rawUser.lastName || nameParts.slice(1).join(' ') || '';
  const role = rawUser.role || (data as any).role || 'CUSTOMER';

  const user: UserProfile = {
    id: String(rawUser.id || `usr-${Date.now()}`),
    firstName,
    lastName,
    name: userData.name || `${firstName} ${lastName}`.trim(),
    email: rawUser.email || userData.email,
    phone: rawUser.phone || '',
    role: String(role).toUpperCase(),
    addresses: rawUser.addresses || [],
    preferences: rawUser.preferences || {
      emailNotifications: true,
      orderUpdates: true,
      promotionalEmails: false,
    },
  };

  return { token, user };
}

