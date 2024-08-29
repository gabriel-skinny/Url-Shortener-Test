import { Url } from "src/application/entities/Url";
import { IShortUrlRepository } from "src/application/repositories/shortUrlRepository";


interface IGetUrlsByUserIdParams {
    userId: string;
}

type IGetUrlsByUserIdReturn = Url[];

export class GetUrlsByUserId {
    constructor(
        private readonly urlRepository: IShortUrlRepository
    ) { }

    async execute({ userId }: IGetUrlsByUserIdParams): Promise<IGetUrlsByUserIdReturn> {
        return this.urlRepository.findManyByUserId(userId);
    }
}