import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from 'src/application/entities/Url';
import { AbstractUrlRepository } from 'src/application/repositories/urlRepository';
import { DataSource, IsNull, Repository } from 'typeorm';
import { UrlEntity } from '../entities/url';
import { UrlEntityMapper } from '../mappers/url';

@Injectable()
export class UrlRepository implements AbstractUrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepository: Repository<UrlEntity>,
    private dataSource: DataSource,
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

  async updateClickByShortenedUrl(shortenedUrl: string) {
    this.dataSource
      .createQueryBuilder()
      .update<UrlEntity>(UrlEntity)
      .set({
        clickNumber: () => 'clickNumber + 1',
      })
      .where('shortenedUrl = :shortenedUrl', { shortenedUrl })
      .execute();
  }
}
