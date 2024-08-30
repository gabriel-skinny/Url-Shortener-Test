import { NotFoundError } from 'src/application/errors/notFound';
import { InMemoryShortUrlRepository } from 'src/application/repositories/inMemoryShortUrlRepository';

import { makeShortUrl } from './factories/makeShortUrl';
import { UpdateUrlUseCase } from '../update';

const makeSut = () => {
  const urlRepository = new InMemoryShortUrlRepository();
  const updateUrlUseCase = new UpdateUrlUseCase(urlRepository);

  return { urlRepository, updateUrlUseCase };
};

describe('Update url use case', () => {
  it('Should update a short url', async () => {
    const { urlRepository, updateUrlUseCase } = makeSut();

    const userId = 'userId12';
    const urlCreated = makeShortUrl({ userId });
    await urlRepository.save(urlCreated);

    const newDestinyUrl = 'newDestinty.com';
    await updateUrlUseCase.execute({
      urlId: urlCreated.id,
      newDestinyUrl,
      userId,
    });

    expect(urlRepository.shortUrlDatabase[0].destinyUrl).toBe(newDestinyUrl);
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
});
