import { NotFoundError } from "src/application/errors/notFound";

import { Url } from "src/application/entities/Url";
import { IShortUrlRepository } from "src/application/repositories/shortUrlRepository";
import { IUserExistsByIdUseCase } from "../user/exists-by-id";

interface ICreateShortUrlParams {
    userId?: string;
    destinyUrl: string;
}

interface ICreateShortUrlReturn {
    shortednedUrl: string;
}

export class CreateShortUrlUseCase {
    constructor(
        private shortUrlRepository: IShortUrlRepository,
        private userExistsByIdUseCase: IUserExistsByIdUseCase
    ) { }

    async execute({ userId, destinyUrl }: ICreateShortUrlParams): Promise<ICreateShortUrlReturn> {
        if (userId && !await this.userExistsByIdUseCase.execute(userId)) throw new NotFoundError("User not found");

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