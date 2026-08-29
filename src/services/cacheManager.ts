/**
 * Multi-Tier High-Performance SWR Cache Manager (Memory + SessionStorage + HTTP ETags)
 * Drastically reduces server load, network bandwidth, and database queries.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

const STORAGE_PREFIX = 'shoply_cache_';

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private inFlight = new Map<string, Promise<any>>();
  private listeners = new Map<string, Set<(data: any) => void>>();

  constructor() {
    // Hydrate persistent catalog cache from sessionStorage on startup
    this.hydrateFromStorage();
  }

  private isPersistentKey(key: string): boolean {
    return key.includes('/categories') || key.includes('/products') || key.includes('/supplier/profile');
  }

  private hydrateFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return;
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          const raw = sessionStorage.getItem(k);
          if (raw) {
            const entry = JSON.parse(raw);
            const actualKey = k.replace(STORAGE_PREFIX, '');
            // Only keep if younger than 15 minutes
            if (Date.now() - entry.timestamp < 900_000) {
              this.cache.set(actualKey, entry);
            } else {
              sessionStorage.removeItem(k);
            }
          }
        }
      }
    } catch {
      // Ignore storage hydration errors
    }
  }

  private persistToStorage<T>(key: string, entry: CacheEntry<T>): void {
    if (!this.isPersistentKey(key)) return;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
      }
    } catch {
      // Storage full or disabled
    }
  }

  private removeFromStorage(pattern?: string | RegExp): void {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return;
      if (!pattern) {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(k);
        }
        return;
      }
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          const actualKey = k.replace(STORAGE_PREFIX, '');
          if (typeof pattern === 'string' && (actualKey.includes(pattern) || actualKey.startsWith(pattern))) {
            sessionStorage.removeItem(k);
          } else if (pattern instanceof RegExp && pattern.test(actualKey)) {
            sessionStorage.removeItem(k);
          }
        }
      }
    } catch {}
  }

  /**
   * Get cached data with configurable TTL and Stale Window
   * Default TTL: 10 minutes (600,000 ms) for catalog, 3 minutes for others
   */
  get<T>(key: string, ttl: number = 600000): { data: T | null; isStale: boolean; etag?: string } {
    let entry = this.cache.get(key);

    // Fallback to storage if not in memory
    if (!entry && this.isPersistentKey(key)) {
      try {
        const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
        if (raw) {
          entry = JSON.parse(raw);
          if (entry) this.cache.set(key, entry);
        }
      } catch {}
    }

    if (!entry) return { data: null, isStale: true };

    const age = Date.now() - entry.timestamp;
    if (age > ttl) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      return { data: null, isStale: true };
    }

    // Stale threshold: 60 seconds for catalog, 30s for other endpoints
    const staleThreshold = key.includes('/categories') || key.includes('/products') ? 60000 : 30000;
    const isStale = age > staleThreshold;

    return { data: entry.data as T, isStale, etag: entry.etag };
  }

  /**
   * Synchronously peek at existing cached data
   */
  peek<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry) return entry.data as T;
    if (this.isPersistentKey(key)) {
      try {
        const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?.data || null;
        }
      } catch {}
    }
    return null;
  }

  getEtag(key: string): string | undefined {
    return this.cache.get(key)?.etag;
  }

  /**
   * Set cached data, save to Tier-2 storage, and notify subscribers
   */
  set<T>(key: string, data: T, etag?: string): void {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), etag };
    this.cache.set(key, entry);
    this.persistToStorage(key, entry);

    const subs = this.listeners.get(key);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.warn('[CacheManager] Listener error:', e);
        }
      });
    }
  }

  /**
   * Touch timestamp when server returns 304 Not Modified
   */
  touch(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.timestamp = Date.now();
      this.persistToStorage(key, entry);
    }
  }

  getInFlight<T>(key: string): Promise<T> | undefined {
    return this.inFlight.get(key);
  }

  setInFlight<T>(key: string, promise: Promise<T>): void {
    this.inFlight.set(key, promise);
  }

  removeInFlight(key: string): void {
    this.inFlight.delete(key);
  }

  /**
   * Invalidate cached entries matching a string pattern or RegExp
   */
  invalidate(pattern?: string | RegExp): void {
    if (!pattern) {
      this.cache.clear();
      this.removeFromStorage();
      return;
    }
    for (const key of Array.from(this.cache.keys())) {
      if (typeof pattern === 'string') {
        if (key.includes(pattern) || key.startsWith(pattern)) {
          this.cache.delete(key);
        }
      } else if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
    this.removeFromStorage(pattern);
  }

  /**
   * Subscribe to updates on a specific cache key
   */
  subscribe<T>(key: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.cache.clear();
    this.inFlight.clear();
    this.removeFromStorage();
  }
}

export const apiCache = new CacheManager();

