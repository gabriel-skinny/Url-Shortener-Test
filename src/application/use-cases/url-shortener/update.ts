import { NotFoundError } from "src/application/errors/notFound";
import { IShortUrlRepository } from "src/application/repositories/shortUrlRepository";


interface IUpdateUrlUseCaseParams {
    urlId: string;
    userId: string;
    newDesitinyUrl: string;
}


export class UpdateUrlUseCase {
    constructor(
        private readonly urlRepository: IShortUrlRepository
    ) { }

    async execute({ userId, urlId, newDesitinyUrl }: IUpdateUrlUseCaseParams): Promise<void> {
        const urlToUpdate = await this.urlRepository.findByIdAndUserId({ id: urlId, userId })

        if (!urlToUpdate) throw new NotFoundError("Url to update not found");

        urlToUpdate.destinyUrl = newDesitinyUrl;

        await this.urlRepository.save(urlToUpdate);
    }
}