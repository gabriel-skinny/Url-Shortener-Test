import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from 'src/application/entities/Url';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';
import { UrlEntity } from '../entities/url';
import { IsNull, Repository } from 'typeorm';
import { UrlEntityMapper } from '../mappers/url';

@Injectable()
export class UrlRepository implements AbstractShortUrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
  ) {}

  async save(url: Url): Promise<void> {
    const urlEntity = UrlEntityMapper.toDatabase(url);

    await this.urlRepository.save(urlEntity);
  }

  async findByUrlDestinyUrlAndUser({
    destinyUrl,
    userId,
  }: {
    destinyUrl: string;
    userId?: string;
  }): Promise<Url | null> {
    const urlFound = await this.urlRepository.findOne({
      where: { destinyUrl, userId },
    });

    if (!urlFound) return null;

    return UrlEntityMapper.toDomain(urlFound);
  }

  async findByUrlDestinyUrlAndUserIsNull({
    destinyUrl,
  }: {
    destinyUrl: string;
  }): Promise<Url | null> {
    const urlFound = await this.urlRepository.findOne({
      where: { destinyUrl, userId: IsNull() },
    });

    if (!urlFound) return null;

    return UrlEntityMapper.toDomain(urlFound);
  }

  async findByIdAndUserId({
    id,
    userId,
  }: {
    userId: string;
    id: string;
  }): Promise<Url | null> {
    const urlFound = await this.urlRepository.findOne({
      where: { id, userId },
    });

    if (!urlFound) return null;

    return UrlEntityMapper.toDomain(urlFound);
  }

  async findManyByUserId(userId: string): Promise<Url[]> {
    const urlsFound = await this.urlRepository.find({ where: { userId } });

    return urlsFound.map(UrlEntityMapper.toDomain);
  }

  async findByShortenedUrl(shortenedUrl: string): Promise<Url | null> {
    const urlFound = await this.urlRepository.findOne({
      where: { shortenedUrl },
    });

    if (!urlFound) return null;

    return UrlEntityMapper.toDomain(urlFound);
  }
}
