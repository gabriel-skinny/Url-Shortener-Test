import { NotFoundError } from 'src/application/errors/notFound';
import { InMemoryUrlRepository } from 'src/application/repositories/inMemoryUrlRepository';
import { RedirectUseCase } from '../redirect';
import { makeShortUrl } from './factories/makeShortUrl';
import { InMemoryCacheService } from 'src/application/services/inMemoryCache';

const makeSut = () => {
  const urlRepository = new InMemoryUrlRepository();
  const cacheService = new InMemoryCacheService();
  const redirectUseCase = new RedirectUseCase(urlRepository, cacheService);

  return { urlRepository, redirectUseCase, cacheService };
};

describe('Redirect url use case', () => {
  it('Should return the desitiny url of a shortenedUrl, add a click to the url and save on cache', async () => {
    const { urlRepository, redirectUseCase, cacheService } = makeSut();

    cacheService.set = jest.fn();

    const userId = 'userId12';
    const urlShortened = makeShortUrl({ userId });
    await urlRepository.save(urlShortened);

    const response = await redirectUseCase.execute({
      shortenedUrlValue: urlShortened.shortenedUrl.split('/')[1],
    });

    expect(response.desitinyUrl).toBe(urlShortened.destinyUrl);
    expect(urlRepository.urlDatabase[0].clickNumber).toBe(1);
    expect(cacheService.set).toHaveBeenCalledTimes(1);
  });

  it('Should return the desitiny from cache if its cached and add a click to the url', async () => {
    const { urlRepository, redirectUseCase, cacheService } = makeSut();

    const userId = 'userId12';
    const urlShortened = makeShortUrl({ userId });
    await urlRepository.save(urlShortened);
    await cacheService.set({
      key: urlShortened.shortenedUrl,
      value: urlShortened.destinyUrl,
    });

    urlRepository.findByShortenedUrl = jest.fn();

    const response = await redirectUseCase.execute({
      shortenedUrlValue: urlShortened.shortenedUrl.split('/')[1],
    });

    expect(response.desitinyUrl).toBe(urlShortened.destinyUrl);
    expect(urlRepository.urlDatabase[0].clickNumber).toBe(1);
    expect(urlRepository.findByShortenedUrl).not.toHaveBeenCalled();
  });

  it('Should throw an notFound error if the short url passed does not exists', async () => {
    const { redirectUseCase } = makeSut();

    const updateUrlUseCasePromise = redirectUseCase.execute({
      shortenedUrlValue: 'NonExistingShortenedUrl',
    });

    expect(updateUrlUseCasePromise).rejects.toStrictEqual(
      new NotFoundError('Shortened url not found with that name'),
    );
  });
});
