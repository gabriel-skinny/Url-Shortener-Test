import { NotFoundError } from "src/application/errors/notFound";
import { InMemoryShortUrlRepository } from "src/application/repositories/inMemoryShortUrlRepository";
import { UpdateUrlUseCase } from "../update-url-use-case";
import { makeShortUrl } from "./factories/makeShortUrl";


const makeSut = () => {
    const urlRepository = new InMemoryShortUrlRepository();
    const updateUrlUseCase = new UpdateUrlUseCase(urlRepository);

    return { urlRepository, updateUrlUseCase }
}

describe("Update url use case", () => {
    it("Should update a short url", async () => {
        const { urlRepository, updateUrlUseCase } = makeSut();

        const userId = "userId12"
        const urlCreated = makeShortUrl({ userId });
        await urlRepository.save(urlCreated);

        const newDesitinyUrl = "newDestinty.com"
        await updateUrlUseCase.execute({
            urlId: urlCreated.id,
            newDesitinyUrl,
            userId
        });

        expect(urlRepository.shortUrlDatabase[0].destinyUrl).toBe(newDesitinyUrl);
    });

    it("Should throw an notFound error if the short url passed does not exists", async () => {
        const { updateUrlUseCase, urlRepository } = makeSut();

        const updateUrlUseCasePromise = updateUrlUseCase.execute({
            newDesitinyUrl: "newDestinty@gmail",
            urlId: "NonExistingUrlId",
            userId: "userId123"
        });

        expect(updateUrlUseCasePromise).rejects.toStrictEqual(new NotFoundError("Url to update not found"))
    })
})