import { NotFoundError } from 'src/application/errors/notFound';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';

interface IDeleteUrlUseCaseParams {
  urlId: string;
  userId: string;
}

export class DeleteUrlUseCase {
  constructor(private readonly urlRepository: AbstractShortUrlRepository) {}

  async execute({ userId, urlId }: IDeleteUrlUseCaseParams): Promise<void> {
    const urlToUpdate = await this.urlRepository.findByIdAndUserId({
      id: urlId,
      userId,
    });

    if (!urlToUpdate) throw new NotFoundError('Url to delete not found');

    urlToUpdate.delete();

    await this.urlRepository.save(urlToUpdate);
  }
}
