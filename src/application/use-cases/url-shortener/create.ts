import { NotFoundError } from 'src/application/errors/notFound';

import { Url } from 'src/application/entities/Url';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';
import { AbstractUserExistsByIdUseCase } from '../user/exists-by-id';
import { Injectable } from '@nestjs/common';

interface ICreateShortUrlParams {
  userId?: string;
  destinyUrl: string;
}

interface ICreateShortUrlReturn {
  shortednedUrl: string;
}

@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    private shortUrlRepository: AbstractShortUrlRepository,
    private userExistsByIdUseCase: AbstractUserExistsByIdUseCase,
  ) {}

  async execute({
    userId,
    destinyUrl,
  }: ICreateShortUrlParams): Promise<ICreateShortUrlReturn> {
    let urlSaved: Url | undefined;
    if (userId) {
      if (!(await this.userExistsByIdUseCase.execute(userId)))
        throw new NotFoundError('User not found');

      urlSaved = await this.shortUrlRepository.findByUrlDestinyUrlAndUser({
        destinyUrl,
        userId,
      });
    } else {
      urlSaved = await this.shortUrlRepository.findByUrlDestinyUrlAndUserIsNull(
        {
          destinyUrl,
        },
      );
    }

    if (urlSaved) return { shortednedUrl: urlSaved.shortenedUrl };

    const url = new Url({
      destinyUrl,
      userId,
    });
    this.shortUrlRepository.save(url);

    return { shortednedUrl: url.shortenedUrl };
  }
}
