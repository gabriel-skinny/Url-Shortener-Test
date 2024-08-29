import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../errors/notFound';
import { AbstractShortUrlRepository } from '../../repositories/shortUrlRepository';

interface IRedirectUseCaseParams {
  shortenedUrlValue: string;
}

interface IRedirectUseCaseReturn {
  desitinyUrl: string;
}

@Injectable()
export class RedirectUseCase {
  constructor(private shortUrlRepository: AbstractShortUrlRepository) {}

  async execute({
    shortenedUrlValue,
  }: IRedirectUseCaseParams): Promise<IRedirectUseCaseReturn> {
    const shortenedUrl = `${process.env.HOST_URL}/${shortenedUrlValue}`;
    const url = await this.shortUrlRepository.findByShortenedUrl(shortenedUrl);

    if (!url) throw new NotFoundError('Shortened url not found with that name');

    return { desitinyUrl: url.destinyUrl };
  }
}
