import { Url } from "../entities/Url";
import { AbstractShortUrlRepository } from "./shortUrlRepository";

export class InMemoryShortUrlRepository implements AbstractShortUrlRepository {
    public shortUrlDatabase: Url[] = [];

    async save(data: Url): Promise<void> {
        this.shortUrlDatabase.push(data);
    }

    async findByUrlDestinyUrlAndUser(data: { destinyUrl: string; userId?: string; }): Promise<Url | null> {
        return this.shortUrlDatabase.find(url => url.destinyUrl == data.destinyUrl && url.userId == data.userId);
    }

    async findByUrlDestinyUrl(data: { destinyUrl: string; }): Promise<Url | null> {
        return this.shortUrlDatabase.find(url => url.destinyUrl == data.destinyUrl);
    }

    async findByIdAndUserId(data: { userId: string; id: string; }): Promise<Url | null> {
        return this.shortUrlDatabase.find(url => url.userId == data.userId && url.id == data.id);
    }

    async findManyByUserId(userId: string): Promise<Url[]> {
        return this.shortUrlDatabase.filter(url => url.userId == userId);
    }

    async findByShortenedUrl(shortenedUrl: string): Promise<Url | null> {
        return this.shortUrlDatabase.find(url => url.shortenedUrl == shortenedUrl);
    }

} 