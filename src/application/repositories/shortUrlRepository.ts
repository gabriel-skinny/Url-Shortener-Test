import { Url } from '../entities/Url';

export abstract class AbstractShortUrlRepository {
  abstract save(data: Url): Promise<void>;
  abstract findByUrlDestinyUrlAndUser(data: {
    destinyUrl: string;
    userId?: string;
  }): Promise<Url | null>;
  abstract findByUrlDestinyUrlAndUserIsNull(data: {
    destinyUrl: string;
  }): Promise<Url | null>;
  abstract findByIdAndUserId(data: {
    userId: string;
    id: string;
  }): Promise<Url | null>;
  abstract findManyByUserId(userId: string): Promise<Url[]>;
  abstract findByShortenedUrl(shortenedUrl: string): Promise<Url | null>;
}
