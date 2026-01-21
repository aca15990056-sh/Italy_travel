type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 6;

function isExpired(entry: CacheEntry<unknown>) {
  return Date.now() > entry.expiresAt;
}

function getLocalStorageEntry<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function setLocalStorageEntry<T>(key: string, entry: CacheEntry<T>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore
  }
}

export function getCache<T>(key: string): T | null {
  const mem = memoryCache.get(key);
  if (mem && !isExpired(mem)) {
    return mem.value as T;
  }
  const stored = getLocalStorageEntry<T>(key);
  if (stored && !isExpired(stored)) {
    memoryCache.set(key, stored);
    return stored.value;
  }
  return null;
}

export function setCache<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS) {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttlMs
  };
  memoryCache.set(key, entry);
  setLocalStorageEntry(key, entry);
}
