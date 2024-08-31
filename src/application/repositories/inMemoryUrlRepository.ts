import { Url } from '../entities/Url';
import { AbstractUrlRepository } from './urlRepository';

export class InMemoryUrlRepository implements AbstractUrlRepository {
  public urlDatabase: Url[] = [];

  async save(data: Url): Promise<void> {
    this.urlDatabase.push(data);
  }

  async findByUrlDestinyUrlAndUser(data: {
    destinyUrl: string;
    userId?: string;
  }): Promise<Url | null> {
    return this.urlDatabase.find(
      (url) => url.destinyUrl == data.destinyUrl && url.userId == data.userId,
    );
  }

  async findByUrlDestinyUrlAndUserIsNull(data: {
    destinyUrl: string;
  }): Promise<Url | null> {
    return this.urlDatabase.find((url) => url.destinyUrl == data.destinyUrl);
  }

  async findByIdAndUserId(data: {
    userId: string;
    id: string;
  }): Promise<Url | null> {
    return this.urlDatabase.find(
      (url) => url.userId == data.userId && url.id == data.id,
    );
  }

  async findManyByUserId(userId: string): Promise<Url[]> {
    return this.urlDatabase.filter((url) => url.userId == userId);
  }

  async findByShortenedUrl(shortenedUrl: string): Promise<Url | null> {
    return this.urlDatabase.find((url) => url.shortenedUrl == shortenedUrl);
  }

  async updateClickByShortenedUrl(shortenedUrl: string) {
    const foundedIndex = this.urlDatabase.findIndex(
      (url) => url.shortenedUrl == shortenedUrl,
    );

    this.urlDatabase[foundedIndex].click();
  }
}
