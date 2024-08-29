import { NotFoundError } from "../../errors/notFound";
import { AbstractShortUrlRepository } from "../../repositories/shortUrlRepository";

interface IRedirectUseCaseParams {
    shortenedUrl: string;
}

interface IRedirectUseCaseReturn {
    desitinyUrl: string;
}

export class RedirectUseCase {
    constructor(private shortUrlRepository: AbstractShortUrlRepository) { }

    async execute({ shortenedUrl }: IRedirectUseCaseParams): Promise<IRedirectUseCaseReturn> {
        const url = await this.shortUrlRepository.findByShortenedUrl(shortenedUrl);

        if (!url) throw new NotFoundError("Shortened url not found with that name");

        return { desitinyUrl: url.destinyUrl };
    }
}