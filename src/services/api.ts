export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let token = localStorage.getItem('token');
  try {
    const { auth } = await import('../lib/firebase');
    if (auth && auth.currentUser) {
      const freshToken = await auth.currentUser.getIdToken();
      if (freshToken) {
        token = freshToken;
        localStorage.setItem('token', freshToken);
      }
    }
  } catch {
    // If Firebase is uninitialized or offline, use stored localStorage token
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  let responseData: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // If server rejects the token as unauthorized/forbidden, clean up stale session token
      localStorage.removeItem('token');
    }

    const message =
      (typeof responseData === 'object' && responseData !== null && (responseData.message || responseData.error)) ||
      (typeof responseData === 'string' && responseData) ||
      `HTTP Error ${response.status}: ${response.statusText}`;

    throw new ApiError(response.status, message, responseData);
  }

  return responseData as T;
}
