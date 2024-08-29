import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Url } from "src/application/entities/Url";
import { IShortUrlRepository } from "src/application/repositories/shortUrlRepository";
import { UrlEntity } from "../entities/url";
import { Repository } from "typeorm";
import { urlEntityToRaw } from "../mappers/url";

@Injectable()
export class UrlRepository implements IShortUrlRepository {
    constructor(
        @InjectRepository(UrlEntity)
        private urlRepository: Repository<UrlEntity>,
    ) { }


    async save(data: Url): Promise<void> {
        this.urlRepository.save(data);
    }

    async findByUrlDestinyUrlAndUser({ destinyUrl, userId }: { destinyUrl: string; userId?: string; }): Promise<Url | null> {
        const urlFound = await this.urlRepository.findOne({ where: { destinyUrl, userId } });

        if (!urlFound) return null;

        return urlEntityToRaw(urlFound);
    }

    async findByUrlDestinyUrl({ destinyUrl }: { destinyUrl: string; }): Promise<Url | null> {
        const urlFound = await this.urlRepository.findOne({ where: { destinyUrl } });

        if (!urlFound) return null;

        return urlEntityToRaw(urlFound);
    }

    async findByIdAndUserId({ id, userId }: { userId: string; id: string; }): Promise<Url | null> {
        const urlFound = await this.urlRepository.findOne({ where: { id, userId } });

        if (!urlFound) return null;

        return urlEntityToRaw(urlFound);
    }

    async findManyByUserId(userId: string): Promise<Url[]> {
        const urlsFound = await this.urlRepository.find({ where: { userId } });

        return urlsFound.map(urlEntityToRaw);
    }

    async findByShortenedUrl(shortenedUrl: string): Promise<Url | null> {
        const urlFound = await this.urlRepository.findOne({ where: { shortenedUrl } });

        if (!urlFound) return null;

        return urlEntityToRaw(urlFound);
    }
}