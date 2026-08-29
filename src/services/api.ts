import { apiCache } from './cacheManager';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

export { apiCache } from './cacheManager';

export interface ApiFetchOptions extends RequestInit {
  skipCache?: boolean;
  cacheTTL?: number;
  forceRefresh?: boolean;
  invalidatePatterns?: (string | RegExp)[];
}

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

export function getGuestSessionId(): string {
  try {
    let id = localStorage.getItem('shoply_guest_session_id');
    if (!id) {
      id = 'gst_' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
      localStorage.setItem('shoply_guest_session_id', id);
    }
    return id;
  } catch {
    return 'gst_fallback_device';
  }
}

/**
 * Invalidate cache helper
 */
export function invalidateApiCache(pattern?: string | RegExp) {
  apiCache.invalidate(pattern);
}

/**
 * Clear all cache helper
 */
export function clearApiCache() {
  apiCache.clear();
}

/**
 * Peek at cached data synchronously
 */
export function peekApiCache<T>(endpoint: string): T | null {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  return apiCache.peek<T>(url);
}

/**
 * Execute actual HTTP network request
 */
/**
 * Execute actual HTTP network request with conditional ETag headers
 */
async function performNetworkFetch<T>(url: string, options: ApiFetchOptions, etag?: string): Promise<{ data: T; etag?: string; notModified?: boolean }> {
  const headers: Record<string, string> = {
    'X-Guest-Session-ID': getGuestSessionId(),
    ...(options.headers as Record<string, string>),
  };

  if (etag && (options.method || 'GET').toUpperCase() === 'GET') {
    headers['If-None-Match'] = etag;
  }

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

  if (response.status === 304) {
    return { data: null as any, notModified: true };
  }

  if (response.status === 204) {
    return { data: {} as T };
  }

  const responseEtag = response.headers.get('ETag') || response.headers.get('etag') || undefined;

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
      localStorage.removeItem('token');
    }

    const message =
      (typeof responseData === 'object' && responseData !== null && (responseData.message || responseData.error)) ||
      (typeof responseData === 'string' && responseData) ||
      `HTTP Error ${response.status}: ${response.statusText}`;

    throw new ApiError(response.status, message, responseData);
  }

  return { data: responseData as T, etag: responseEtag };
}

/**
 * Auto-invalidate related caches for mutating requests
 */
function autoInvalidateMutationCaches(url: string) {
  if (url.includes('/supplier/products') || url.includes('/products')) {
    apiCache.invalidate('/supplier/products');
    apiCache.invalidate('/products');
    apiCache.invalidate('/categories');
    apiCache.invalidate('/supplier/dashboard');
  }
  if (url.includes('/supplier/purchase-orders') || url.includes('/admin/purchase-orders')) {
    apiCache.invalidate('/supplier/purchase-orders');
    apiCache.invalidate('/supplier/dashboard');
    apiCache.invalidate('/admin/purchase-orders');
  }
  if (url.includes('/cart')) {
    apiCache.invalidate('/cart');
  }
  if (url.includes('/wishlist')) {
    apiCache.invalidate('/wishlist');
  }
  if (url.includes('/orders')) {
    apiCache.invalidate('/orders');
    apiCache.invalidate('/supplier/dashboard');
  }
  if (url.includes('/supplier/profile') || url.includes('/suppliers')) {
    apiCache.invalidate('/supplier/profile');
    apiCache.invalidate('/suppliers');
    apiCache.invalidate('/supplier/dashboard');
  }
  if (url.includes('/reviews')) {
    apiCache.invalidate('/reviews');
    apiCache.invalidate('/products');
  }
}

/**
 * High-Performance API Fetch with Multi-Tier SWR Caching & Server Load Optimization
 */
export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';

  // For non-GET requests (mutations: POST, PUT, DELETE, PATCH), execute directly and invalidate caches
  if (!isGet) {
    const res = await performNetworkFetch<T>(url, options);
    
    // Auto-invalidate domain caches
    autoInvalidateMutationCaches(url);
    if (options.invalidatePatterns) {
      options.invalidatePatterns.forEach((p) => apiCache.invalidate(p));
    }
    return res.data;
  }

  // GET Requests: Multi-Tier Cache Check
  const shouldCache = !options.skipCache;
  const cacheKey = url;
  // Default TTL: 10 minutes for catalog endpoints, 3 minutes for others
  const defaultTTL = url.includes('/categories') || url.includes('/products') ? 600000 : 180000;
  const ttl = options.cacheTTL || defaultTTL;

  if (shouldCache && !options.forceRefresh) {
    const { data: cachedData, isStale, etag } = apiCache.get<T>(cacheKey, ttl);

    if (cachedData !== null) {
      // If stale, trigger background revalidation quietly with ETag
      if (isStale) {
        performNetworkFetch<T>(url, options, etag)
          .then((res) => {
            if (res.notModified) {
              apiCache.touch(cacheKey);
            } else if (res.data) {
              apiCache.set(cacheKey, res.data, res.etag);
            }
          })
          .catch((err) => {
            console.debug('[apiFetch] Background SWR refresh failed silently:', err);
          });
      }
      return cachedData;
    }
  }

  // Check if there is already an in-flight promise for this exact GET URL
  const inFlightPromise = apiCache.getInFlight<T>(cacheKey);
  if (inFlightPromise && shouldCache) {
    return inFlightPromise;
  }

  // Create network promise and register as in-flight
  const existingEtag = apiCache.getEtag(cacheKey);
  const networkPromise = performNetworkFetch<T>(url, options, existingEtag)
    .then((res) => {
      if (res.notModified) {
        apiCache.touch(cacheKey);
        return apiCache.peek<T>(cacheKey) as T;
      }
      if (shouldCache && res.data) {
        apiCache.set(cacheKey, res.data, res.etag);
      }
      return res.data;
    })
    .finally(() => {
      apiCache.removeInFlight(cacheKey);
    });

  if (shouldCache) {
    apiCache.setInFlight(cacheKey, networkPromise);
  }

  return networkPromise;
}

