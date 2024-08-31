import { NotFoundError } from 'src/application/errors/notFound';
import { InMemoryShortUrlRepository } from 'src/application/repositories/inMemoryShortUrlRepository';

import { makeShortUrl } from './factories/makeShortUrl';
import { DeleteUrlUseCase } from '../delete';
import { InMemoryCacheService } from 'src/application/services/inMemoryCache';

const makeSut = () => {
  const urlRepository = new InMemoryShortUrlRepository();
  const cacheService = new InMemoryCacheService();
  const deleteUrlUseCase = new DeleteUrlUseCase(urlRepository, cacheService);

  return { urlRepository, deleteUrlUseCase, cacheService };
};

describe('Delete url use case', () => {
  it('Should delete a short url from database and cache', async () => {
    const { urlRepository, deleteUrlUseCase, cacheService } = makeSut();

    const userId = 'userId12';
    const urlCreated = makeShortUrl({ userId });
    await urlRepository.save(urlCreated);

    await deleteUrlUseCase.execute({
      urlId: urlCreated.id,
      userId,
    });

    expect(urlRepository.shortUrlDatabase[0].deletedAt).toBeTruthy();
    expect(cacheService.cacheDatabase).toStrictEqual({});
  });

  it('Should throw an notFound error if the short url passed does not exists', async () => {
    const { deleteUrlUseCase } = makeSut();

    const updateUrlUseCasePromise = deleteUrlUseCase.execute({
      urlId: 'NonExistingUrlId',
      userId: 'userId123',
    });

    expect(updateUrlUseCasePromise).rejects.toStrictEqual(
      new NotFoundError('Url to delete not found'),
    );
  });
});
