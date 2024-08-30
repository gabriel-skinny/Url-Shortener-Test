import { InMemoryShortUrlRepository } from 'src/application/repositories/inMemoryShortUrlRepository';

import { makeShortUrl } from './factories/makeShortUrl';
import { GetUrlsByUserIdUseCase } from '../get-urls-by-user-id';

const makeSut = () => {
  const urlRepository = new InMemoryShortUrlRepository();
  const getUrlsByUserId = new GetUrlsByUserIdUseCase(urlRepository);

  return { urlRepository, getUrlsByUserId };
};

describe('Get urls by user id use case', () => {
  it('Should return all short urls of a user', async () => {
    const { getUrlsByUserId, urlRepository } = makeSut();

    const userId = 'userId123';
    const shortUrlsCreated = [
      makeShortUrl({ userId }),
      makeShortUrl({ userId }),
      makeShortUrl({ userId }),
    ];
    for (const shortUrl of shortUrlsCreated) await urlRepository.save(shortUrl);

    const response = await getUrlsByUserId.execute({ userId });

    expect(response).toStrictEqual(shortUrlsCreated);
  });
});
