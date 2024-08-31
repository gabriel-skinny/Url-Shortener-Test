import { NotFoundError } from 'src/application/errors/notFound';
import { InMemoryUrlRepository } from 'src/application/repositories/inMemoryUrlRepository';

import { makeShortUrl } from './factories/makeShortUrl';
import { UpdateUrlUseCase } from '../update';
import { AlreadyCreatedError } from 'src/application/errors/alreadyCreated';
import { InMemoryCacheService } from 'src/application/services/inMemoryCache';

const makeSut = () => {
  const urlRepository = new InMemoryUrlRepository();
  const cacheService = new InMemoryCacheService();
  const updateUrlUseCase = new UpdateUrlUseCase(urlRepository, cacheService);

  return { urlRepository, updateUrlUseCase, cacheService };
};

describe('Update url use case', () => {
  it('Should update a short url destiny and delete previous shortened url key from cache', async () => {
    const { urlRepository, updateUrlUseCase, cacheService } = makeSut();

    const userId = 'userId12';
    const urlCreated = makeShortUrl({ userId });
    await urlRepository.save(urlCreated);

    const newDestinyUrl = 'newDestinty.com';
    await updateUrlUseCase.execute({
      urlId: urlCreated.id,
      newDestinyUrl,
      userId,
    });

    expect(urlRepository.urlDatabase[0].destinyUrl).toBe(newDestinyUrl);
    expect(cacheService.cacheDatabase).toStrictEqual({});
  });

  it('Should throw an notFound error if the short url passed does not exists', async () => {
    const { updateUrlUseCase } = makeSut();

    const updateUrlUseCasePromise = updateUrlUseCase.execute({
      newDestinyUrl: 'newDestinty@gmail',
      urlId: 'NonExistingUrlId',
      userId: 'userId123',
    });

    expect(updateUrlUseCasePromise).rejects.toStrictEqual(
      new NotFoundError('Url to update not found'),
    );
  });

  it('Should throw an AlreadyCreatedError error if the new desinty url is already registred for that user', async () => {
    const { urlRepository, updateUrlUseCase } = makeSut();

    const userId = 'userId12';
    const urlCreated = makeShortUrl({ userId });
    await urlRepository.save(urlCreated);

    const newDestinyUrl = urlCreated.destinyUrl;
    const updateUrlUseCasePromise = updateUrlUseCase.execute({
      urlId: urlCreated.id,
      newDestinyUrl,
      userId,
    });

    expect(updateUrlUseCasePromise).rejects.toStrictEqual(
      new AlreadyCreatedError('User already has that destiny url registred'),
    );
  });
});
