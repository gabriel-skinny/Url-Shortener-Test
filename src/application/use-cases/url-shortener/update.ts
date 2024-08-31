import { Injectable } from '@nestjs/common';
import { AlreadyCreatedError } from 'src/application/errors/alreadyCreated';
import { NotFoundError } from 'src/application/errors/notFound';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';
import { AbstractCacheService } from 'src/application/services/cache';

interface IUpdateUrlUseCaseParams {
  urlId: string;
  userId: string;
  newDestinyUrl: string;
}

@Injectable()
export class UpdateUrlUseCase {
  constructor(
    private readonly urlRepository: AbstractShortUrlRepository,
    private readonly cacheService: AbstractCacheService,
  ) {}

  async execute({
    userId,
    urlId,
    newDestinyUrl,
  }: IUpdateUrlUseCaseParams): Promise<void> {
    const urlToUpdate = await this.urlRepository.findByIdAndUserId({
      id: urlId,
      userId,
    });

    if (!urlToUpdate) throw new NotFoundError('Url to update not found');

    const alreadyExistsWithNewDestiny =
      await this.urlRepository.findByUrlDestinyUrlAndUser({
        destinyUrl: newDestinyUrl,
        userId,
      });
    if (alreadyExistsWithNewDestiny)
      throw new AlreadyCreatedError(
        'User already has that destiny url registred',
      );

    await this.cacheService.delete(urlToUpdate.shortenedUrl);

    urlToUpdate.destinyUrl = newDestinyUrl;
    urlToUpdate.makeShortenedUrl();

    await this.urlRepository.save(urlToUpdate);
  }
}
