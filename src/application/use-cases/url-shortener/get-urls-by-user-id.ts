import { Injectable } from '@nestjs/common';
import { Url } from 'src/application/entities/Url';
import { AbstractUrlRepository } from 'src/application/repositories/urlRepository';

interface IGetUrlsByUserIdParams {
  userId: string;
}

type IGetUrlsByUserIdReturn = Url[];

@Injectable()
export class GetUrlsByUserIdUseCase {
  constructor(private readonly urlRepository: AbstractUrlRepository) {}

  async execute({
    userId,
  }: IGetUrlsByUserIdParams): Promise<IGetUrlsByUserIdReturn> {
    return this.urlRepository.findManyByUserId(userId);
  }
}
