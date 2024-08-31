import { Injectable } from '@nestjs/common';
import { AlreadyCreatedError } from 'src/application/errors/alreadyCreated';
import { NotFoundError } from 'src/application/errors/notFound';
import { AbstractUrlRepository } from 'src/application/repositories/urlRepository';
import { AbstractCacheService } from 'src/application/services/cache';

interface IUpdateUrlUseCaseParams {
  urlId: string;
  userId: string;
  newDestinyUrl: string;
}

@Injectable()
export class UpdateUrlUseCase {
  constructor(
    private readonly urlRepository: AbstractUrlRepository,
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

    urlToUpdate.destinyUrl = newDestinyUrl;

    await Promise.all([
      this.cacheService.delete(urlToUpdate.shortenedUrl),
      this.urlRepository.save(urlToUpdate),
    ]);
  }
}
