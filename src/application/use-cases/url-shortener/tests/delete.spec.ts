import { NotFoundError } from "src/application/errors/notFound";
import { InMemoryShortUrlRepository } from "src/application/repositories/inMemoryShortUrlRepository";

import { makeShortUrl } from "./factories/makeShortUrl";
import { DeleteUrlUseCase } from "../delete";


const makeSut = () => {
    const urlRepository = new InMemoryShortUrlRepository();
    const deleteUrlUseCase = new DeleteUrlUseCase(urlRepository);

    return { urlRepository, deleteUrlUseCase }
}

describe("Delete url use case", () => {
    it("Should delete a short url", async () => {
        const { urlRepository, deleteUrlUseCase } = makeSut();

        const userId = "userId12"
        const urlCreated = makeShortUrl({ userId });
        await urlRepository.save(urlCreated);

        await deleteUrlUseCase.execute({
            urlId: urlCreated.id,
            userId
        });

        expect(urlRepository.shortUrlDatabase[0].deletedAt).toBeTruthy();
    });

    it("Should throw an notFound error if the short url passed does not exists", async () => {
        const { deleteUrlUseCase } = makeSut();

        const updateUrlUseCasePromise = deleteUrlUseCase.execute({
            urlId: "NonExistingUrlId",
            userId: "userId123"
        });

        expect(updateUrlUseCasePromise).rejects.toStrictEqual(new NotFoundError("Url to delete not found"))
    })
})