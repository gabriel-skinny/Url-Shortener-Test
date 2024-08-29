import { InMemoryShortUrlRepository } from 'src/application/repositories/inMemoryShortUrlRepository';
import { CreateShortUrlUseCase } from '../create';
import { makeShortUrl } from './factories/makeShortUrl';
import UserExistsByIdUseCaseStub from './stubs/userExistsById';
import { NotFoundError } from 'src/application/errors/notFound';

const makeSut = () => {
  const shortUrlRepository = new InMemoryShortUrlRepository();
  const userExistsByIdUseCase = new UserExistsByIdUseCaseStub();
  const createShortUrlUseCase = new CreateShortUrlUseCase(
    shortUrlRepository,
    userExistsByIdUseCase,
  );

  return { shortUrlRepository, createShortUrlUseCase, userExistsByIdUseCase };
};

describe('Create short url use case', () => {
  it('Should create a short url for a none user and return it', async () => {
    const { shortUrlRepository, createShortUrlUseCase } = makeSut();

    const response = await createShortUrlUseCase.execute({
      destinyUrl: 'desitinyUrl',
    });

    expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
    expect(response.shortednedUrl).toBeTruthy();
  });

  it('Should create a short url for a user', async () => {
    const { shortUrlRepository, createShortUrlUseCase } = makeSut();

    const userId = 'userId123';
    const response = await createShortUrlUseCase.execute({
      destinyUrl: 'desitinyUrl',
      userId,
    });

    expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
    expect(shortUrlRepository.shortUrlDatabase[0].userId).toBe(userId);
    expect(response.shortednedUrl).toBeTruthy();
  });

  it('Should return an already existing short url for a none user', async () => {
    const { shortUrlRepository, createShortUrlUseCase } = makeSut();

    const shortUrlCreated = makeShortUrl();
    await shortUrlRepository.save(shortUrlCreated);

    const response = await createShortUrlUseCase.execute({
      destinyUrl: shortUrlCreated.destinyUrl,
    });

    expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
    expect(response.shortednedUrl).toBe(shortUrlCreated.shortenedUrl);
  });

  it('Should return an already existing short url for a user', async () => {
    const { shortUrlRepository, createShortUrlUseCase } = makeSut();

    const userId = 'userId123';
    const shortUrlCreated = makeShortUrl({ userId });
    await shortUrlRepository.save(shortUrlCreated);

    const response = await createShortUrlUseCase.execute({
      destinyUrl: shortUrlCreated.destinyUrl,
      userId,
    });

    expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
    expect(response.shortednedUrl).toBe(shortUrlCreated.shortenedUrl);
  });

  it('Should throw an error with user passed does not exists', async () => {
    const { shortUrlRepository, createShortUrlUseCase, userExistsByIdUseCase } =
      makeSut();

    userExistsByIdUseCase.execute = jest.fn().mockReturnValueOnce(false);

    const createShortUrlUseCasePromise = createShortUrlUseCase.execute({
      destinyUrl: 'destinyUrl',
      userId: 'userId123',
    });

    expect(createShortUrlUseCasePromise).rejects.toStrictEqual(
      new NotFoundError('User not found'),
    );
  });

  it('Should not throw an error with none users was passed', async () => {
    const { shortUrlRepository, createShortUrlUseCase, userExistsByIdUseCase } =
      makeSut();

    userExistsByIdUseCase.execute = jest.fn().mockReturnValueOnce(false);

    await createShortUrlUseCase.execute({
      destinyUrl: 'destinyUrl',
    });

    expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
    expect(userExistsByIdUseCase.execute).toHaveBeenCalledTimes(0);
  });
});
