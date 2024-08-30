import { AbstractCacheService } from './cache';

export class InMemoryCacheService implements AbstractCacheService {
  private cacheDatabase: { [key: string]: any } = {};

  async set(data: { key: string; value: string }): Promise<void> {
    this.cacheDatabase[data.key] = data.value;
  }

  async get<T>(key: string): Promise<T> {
    return this.cacheDatabase[key];
  }
}
