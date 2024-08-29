import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/application/errors/notFound';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';

interface IUpdateUrlUseCaseParams {
  urlId: string;
  userId: string;
  newDestinyUrl: string;
}

@Injectable()
export class UpdateUrlUseCase {
  constructor(private readonly urlRepository: AbstractShortUrlRepository) {}

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

    urlToUpdate.destinyUrl = newDestinyUrl;

    await this.urlRepository.save(urlToUpdate);
  }
}
