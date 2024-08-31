import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/application/errors/notFound';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';
import { AbstractCacheService } from 'src/application/services/cache';

interface IDeleteUrlUseCaseParams {
  urlId: string;
  userId: string;
}

@Injectable()
export class DeleteUrlUseCase {
  constructor(
    private readonly urlRepository: AbstractShortUrlRepository,
    private readonly cacheService: AbstractCacheService,
  ) {}

  async execute({ userId, urlId }: IDeleteUrlUseCaseParams): Promise<void> {
    const urlToUpdate = await this.urlRepository.findByIdAndUserId({
      id: urlId,
      userId,
    });

    if (!urlToUpdate) throw new NotFoundError('Url to delete not found');

    await this.cacheService.delete(urlToUpdate.shortenedUrl);

    urlToUpdate.delete();

    await this.urlRepository.save(urlToUpdate);
  }
}
