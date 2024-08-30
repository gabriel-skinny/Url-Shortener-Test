export abstract class AbstractCacheService {
  abstract set(data: {
    key: string;
    value: string;
    expiresInSeconds: number;
  }): Promise<void>;
  abstract get<T>(key: string): Promise<T>;
}
