import NodeCache from 'node-cache';

const DEFAULT_TTL = 300;

export const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: 60,
  useClones: false,
});

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCache<T>(key: string, value: T, ttl: number = DEFAULT_TTL): boolean {
  return cache.set(key, value, ttl);
}

export function deleteCache(key: string): number {
  return cache.del(key);
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter((k: string) => k.includes(pattern));
    cache.del(matchingKeys);
  } else {
    cache.flushAll();
  }
}

export function invalidateCacheByPrefix(prefix: string): void {
  const keys = cache.keys();
  const matchingKeys = keys.filter((k: string) => k.startsWith(prefix));
  cache.del(matchingKeys);
}

export const CACHE_KEYS = {
  CLIENTS: 'clients:all',
  CLIENT: (id: string) => `clients:${id}`,
  DASHBOARD_STATS: 'dashboard:stats',
  STAFF: 'staff:all',
  ATTENDANCE_TODAY: 'attendance:today',
  ATTENDANCE_USER: (userId: string, date: string) => `attendance:${userId}:${date}`,
};

export default cache;
