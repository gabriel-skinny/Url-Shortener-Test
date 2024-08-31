import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../errors/notFound';
import { AbstractUrlRepository } from '../../repositories/urlRepository';
import { AbstractCacheService } from 'src/application/services/cache';

interface IRedirectUseCaseParams {
  shortenedUrlValue: string;
}

interface IRedirectUseCaseReturn {
  desitinyUrl: string;
}

@Injectable()
export class RedirectUseCase {
  constructor(
    private shortUrlRepository: AbstractUrlRepository,
    private cacheService: AbstractCacheService,
  ) {}

  async execute({
    shortenedUrlValue,
  }: IRedirectUseCaseParams): Promise<IRedirectUseCaseReturn> {
    const shortenedUrl = `${process.env.HOST_URL}/${shortenedUrlValue}`;

    const cachedDestitnyUrl = await this.cacheService.get<string>(shortenedUrl);
    if (cachedDestitnyUrl) {
      this.shortUrlRepository.updateClickByShortenedUrl(shortenedUrl);

      return { desitinyUrl: cachedDestitnyUrl };
    }
    const url = await this.shortUrlRepository.findByShortenedUrl(shortenedUrl);

    if (!url) throw new NotFoundError('Shortened url not found with that name');

    this.cacheService.set({
      key: shortenedUrl,
      value: url.destinyUrl,
      expiresInSeconds: 60 * 60 * 1,
    });

    url.click();
    this.shortUrlRepository.save(url);

    return { desitinyUrl: url.destinyUrl };
  }
}
