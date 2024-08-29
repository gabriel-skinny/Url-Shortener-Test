import { Url } from "../entities/Url";

export interface IShortUrlRepository {
    save(data: Url): Promise<void>;
    findByUrlDesitinyAndUser(data: { destinyUrl: string; userId?: string }): Promise<Url | null>;
    findByIdAndUserId(data: { userId: string; id: string; }): Promise<Url | null>;
    findManyByUserId(userId: string): Promise<Url[]>;
    findByShortenedUrl(shortenedUrl: string): Promise<Url | null>;
}