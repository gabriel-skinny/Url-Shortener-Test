import { InMemoryUserRepository } from "../../../application/repositories/inMemoryUserRepository";
import { CreateUserUseCase } from "../create-user"
import { makeUser } from "./factories/makeUser";
import { AlreadyCreatedError } from "../../../application/errors/alreadyCreated";
import { CreateShortUrlUseCase } from "../create-short-url";
import { InMemoryShortUrlRepository } from "src/application/repositories/inMemoryShortUrlRepository";
import { makeShortUrl } from "./factories/makeShortUrl";


const makeSut = () => {
    const shortUrlRepository = new InMemoryShortUrlRepository();
    const createShortUrlUseCase = new CreateShortUrlUseCase(shortUrlRepository);

    return { shortUrlRepository, createShortUrlUseCase }
}

describe("Create short url use case", () => {
    it("Should create a short url for a none user and return it", async () => {
        const { shortUrlRepository, createShortUrlUseCase } = makeSut();

        const response = await createShortUrlUseCase.execute({
            destinyUrl: "desitinyUrl"
        });

        expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
        expect(response.shortednedUrl).toBeTruthy();
    });

    it("Should create a short url for a user", async () => {
        const { shortUrlRepository, createShortUrlUseCase } = makeSut();

        const userId = "userId123";
        const response = await createShortUrlUseCase.execute({
            destinyUrl: "desitinyUrl",
            userId
        });

        expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
        expect(shortUrlRepository.shortUrlDatabase[0].userId).toBe(userId);
        expect(response.shortednedUrl).toBeTruthy();
    });

    it("Should return an already existing short url for a none user", async () => {
        const { shortUrlRepository, createShortUrlUseCase } = makeSut();

        const shortUrlCreated = makeShortUrl();
        await shortUrlRepository.save(shortUrlCreated);

        const response = await createShortUrlUseCase.execute({
            destinyUrl: shortUrlCreated.destinyUrl
        });

        expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
        expect(response.shortednedUrl).toBe(shortUrlCreated.shortenedUrl);
    });

    it("Should return an already existing short url for a user", async () => {
        const { shortUrlRepository, createShortUrlUseCase } = makeSut();

        const userId = "userId123"
        const shortUrlCreated = makeShortUrl({ userId });
        await shortUrlRepository.save(shortUrlCreated);

        const response = await createShortUrlUseCase.execute({
            destinyUrl: shortUrlCreated.destinyUrl,
            userId
        });

        expect(shortUrlRepository.shortUrlDatabase).toHaveLength(1);
        expect(response.shortednedUrl).toBe(shortUrlCreated.shortenedUrl);
    });
})