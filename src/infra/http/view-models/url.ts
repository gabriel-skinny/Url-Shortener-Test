import { Url } from 'src/application/entities/Url';

export interface IUrlViewModel {
  id: string;
  destinyUrl: string;
  userId?: string;
  clickNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UrlViewModel {
  static toHttp(url: Url): IUrlViewModel {
    return {
      id: url.id,
      destinyUrl: url.id,
      userId: url.id,
      clickNumber: url.clickNumber,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}
