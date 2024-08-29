import { Url } from "src/application/entities/Url";
import { AbstractShortUrlRepository } from "src/application/repositories/shortUrlRepository";


interface IGetUrlsByUserIdParams {
    userId: string;
}

type IGetUrlsByUserIdReturn = Url[];

export class GetUrlsByUserIdUseCase {
    constructor(
        private readonly urlRepository: AbstractShortUrlRepository
    ) { }

    async execute({ userId }: IGetUrlsByUserIdParams): Promise<IGetUrlsByUserIdReturn> {
        return this.urlRepository.findManyByUserId(userId);
    }
}