import { Url } from "src/application/entities/Url";
import { UrlEntity } from "../entities/url";

export class UrlEntityMapper {
    static toDomain(url: UrlEntity): Url {
        return new Url({
            id: url.id,
            destinyUrl: url.destinyUrl,
            userId: url.userId,
            clickNumber: url.clickNumber,
            createdAt: url.createdAt,
            deletedAt: url.deletedAt,
            updatedAt: url.updatedAt,
        })
    }

    static toDatabase(url: Url): UrlEntity {
        return {
            id: url.id,
            destinyUrl: url.destinyUrl,
            userId: url.userId,
            clickNumber: url.clickNumber,
            shortenedUrl: url.shortenedUrl,
            createdAt: url.createdAt,
            deletedAt: url.deletedAt,
            updatedAt: url.updatedAt,
        }
    }
}