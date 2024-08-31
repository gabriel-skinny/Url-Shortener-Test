import { Redis } from 'ioredis';
import { AbstractCacheService } from 'src/application/services/cache';

export class CacheService implements AbstractCacheService {
  constructor(private redis: Redis) {}

  async set({
    key,
    value,
    expiresInSeconds,
  }: {
    key: string;
    value: string;
    expiresInSeconds: number;
  }): Promise<void> {
    this.redis.set(key, value, 'EX', expiresInSeconds);
  }

  async get<T>(key: string): Promise<T> {
    return this.redis.get(key) as T;
  }

  async delete(key: string): Promise<void> {
    this.redis.del(key);
  }
}
