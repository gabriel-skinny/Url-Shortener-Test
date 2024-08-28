import { NotFoundError } from "../errors/notFound";
import { IShortUrlRepository } from "../repositories/shortUrlRepository";

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