import { Url } from "../entities/Url";
import { IShortUrlRepository } from "../repositories/shortUrlRepository";

interface ICreateShortUrlParams {
    userId?: string;
    destinyUrl: string;
}

interface ICreateShortUrlReturn {
    shortednedUrl: string;
}

export class CreateShortUrlUseCase {
    constructor(private shortUrlRepository: IShortUrlRepository) { }

    async execute({ userId, destinyUrl }: ICreateShortUrlParams): Promise<ICreateShortUrlReturn> {
        const urlSaved = await this.shortUrlRepository.findByUrlDesitinyAndUser({ destinyUrl, userId })

        if (urlSaved) return { shortednedUrl: urlSaved.shortenedUrl };

        const url = new Url({
            destinyUrl,
            userId
        });

        await this.shortUrlRepository.save(url);

        return { shortednedUrl: url.shortenedUrl }
    }
}