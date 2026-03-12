import prisma from '../config/database.js';
import { getCached, setCache, invalidateCacheByPrefix } from '../config/cache.js';
import type { GetClientsInput } from '../validators/client.validator.js';

const CACHE_TTL = 300;

interface ClientsResult {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getClients(_userId: string, input: GetClientsInput): Promise<ClientsResult> {
  const { search, page = 1, limit = 20 } = input;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const cacheKey = `clients:list:${search || 'all'}:${page}:${limit}`;
  const cached = getCached<ClientsResult>(cacheKey);
  if (cached) return cached;

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { branch: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: parseInt(limit as string),
    }),
    prisma.client.count({ where }),
  ]);

  const result: ClientsResult = {
    data: clients,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
    },
  };

  setCache(cacheKey, result, CACHE_TTL);
  return result;
}

export async function getRecentClients(userId: string) {
  const cacheKey = `clients:recent:${userId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentAttendances = await prisma.attendanceRecord.findMany({
    where: {
      userId,
      checkInTime: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      client: true,
    },
    orderBy: {
      checkInTime: 'desc',
    },
    take: 10,
  });

  const clientMap = new Map();
  const recentClients = recentAttendances
    .filter((record) => {
      if (clientMap.has(record.clientId)) return false;
      clientMap.set(record.clientId, true);
      return true;
    })
    .map((record) => record.client)
    .slice(0, 5);

  setCache(cacheKey, recentClients, 60);
  return recentClients;
}

export async function searchClients(_userId: string, query: string) {
  if (!query || query.trim() === '') {
    return [];
  }

  const cacheKey = `clients:search:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const clients = await prisma.client.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { branch: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
    take: 20,
  });

  setCache(cacheKey, clients, 120);
  return clients;
}

export async function invalidateClientCache() {
  invalidateCacheByPrefix('clients:');
}
