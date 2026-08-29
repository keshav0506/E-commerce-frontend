import { apiFetch, getGuestSessionId } from './api';
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
  guestSessionId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  guestSessionId?: string;
}

/**
 * Login user (POST /api/auth/login)
 */
export async function loginApi(credentials: LoginRequest): Promise<{ token: string; user: UserProfile }> {
  const payload = {
    ...credentials,
    guestSessionId: credentials.guestSessionId || getGuestSessionId(),
  };

  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
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
  const payload = {
    ...userData,
    guestSessionId: userData.guestSessionId || getGuestSessionId(),
  };

  const data = await apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
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

/**
 * Change Password for logged-in user (POST /api/auth/change-password)
 */
export async function changePasswordApi(passwords: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwords),
  });
}

/**
 * Forgot Password request OTP/Token (POST /api/auth/forgot-password)
 */
export async function forgotPasswordApi(email: string): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Synchronize Firebase user with Spring Boot backend (POST /api/auth/firebase-sync)
 */
export async function firebaseSyncApi(syncData: { idToken: string; name?: string; email?: string; guestSessionId?: string }): Promise<{ token: string; user: UserProfile }> {
  const payload = {
    ...syncData,
    guestSessionId: syncData.guestSessionId || getGuestSessionId(),
  };

  const data = await apiFetch<LoginResponse>('/auth/firebase-sync', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const token = data.token || data.jwt || data.accessToken || syncData.idToken || '';
  if (token) {
    localStorage.setItem('token', token);
  }

  const rawUser = data.user || data;
  const nameParts = (rawUser.name || syncData.name || syncData.email?.split('@')[0] || 'User').split(' ');
  const firstName = rawUser.firstName || nameParts[0] || 'User';
  const lastName = rawUser.lastName || nameParts.slice(1).join(' ') || '';
  const role = rawUser.role || (data as any).role || 'CUSTOMER';

  const user: UserProfile = {
    id: String(rawUser.id || `usr-${Date.now()}`),
    firstName,
    lastName,
    name: rawUser.name || syncData.name || `${firstName} ${lastName}`.trim(),
    email: rawUser.email || syncData.email || '',
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
 * Reset Password with OTP/Token (POST /api/auth/reset-password)
 */
export async function resetPasswordApi(data: { email: string; token: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


