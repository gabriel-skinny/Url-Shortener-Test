import { NotFoundError } from "src/application/errors/notFound";
import { InMemoryShortUrlRepository } from "src/application/repositories/inMemoryShortUrlRepository";
import { RedirectUseCase } from "../redirect";
import { makeShortUrl } from "./factories/makeShortUrl";


const makeSut = () => {
    const urlRepository = new InMemoryShortUrlRepository();
    const redirectUseCase = new RedirectUseCase(urlRepository);

    return { urlRepository, redirectUseCase }
}

describe("Redirect url use case", () => {
    it("Should return the desitiny url of a shortenedUrl", async () => {
        const { urlRepository, redirectUseCase } = makeSut();

        const userId = "userId12";
        const urlShortened = makeShortUrl({ userId });
        await urlRepository.save(urlShortened);

        const response = await redirectUseCase.execute({
            shortenedUrl: urlShortened.shortenedUrl
        });

        expect(response.desitinyUrl).toBe(urlShortened.destinyUrl);
    });

    it("Should throw an notFound error if the short url passed does not exists", async () => {
        const { redirectUseCase } = makeSut();

        const updateUrlUseCasePromise = redirectUseCase.execute({
            shortenedUrl: "NonExistingShortenedUrl"
        });

        expect(updateUrlUseCasePromise).rejects.toStrictEqual(new NotFoundError("Shortened url not found with that name"))
    })
})