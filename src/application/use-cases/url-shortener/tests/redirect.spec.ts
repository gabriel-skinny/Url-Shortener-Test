import { NotFoundError } from 'src/application/errors/notFound';
import { InMemoryShortUrlRepository } from 'src/application/repositories/inMemoryShortUrlRepository';
import { RedirectUseCase } from '../redirect';
import { makeShortUrl } from './factories/makeShortUrl';

const makeSut = () => {
  const urlRepository = new InMemoryShortUrlRepository();
  const redirectUseCase = new RedirectUseCase(urlRepository);

  return { urlRepository, redirectUseCase };
};

describe('Redirect url use case', () => {
  it('Should return the desitiny url of a shortenedUrl and add a click to the url', async () => {
    const { urlRepository, redirectUseCase } = makeSut();

    const userId = 'userId12';
    const urlShortened = makeShortUrl({ userId });
    await urlRepository.save(urlShortened);

    const response = await redirectUseCase.execute({
      shortenedUrlValue: urlShortened.shortenedUrl.split('/')[1],
    });

    expect(response.desitinyUrl).toBe(urlShortened.destinyUrl);
    expect(urlRepository.shortUrlDatabase[0].clickNumber).toBe(1);
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
