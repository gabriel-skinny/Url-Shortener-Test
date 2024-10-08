import { randomUUID } from 'crypto';

import ShortUniqueId from 'short-unique-id';

export interface IUrlProps {
  id?: string;
  destinyUrl: string;
  userId?: string;
  clickNumber?: number;
  shortenedUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Url {
  readonly id: string;
  readonly userId?: string;
  public destinyUrl: string;
  private _clickNumber: number;
  private _shortenedUrl: string;
  readonly createdAt: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  constructor(props: IUrlProps) {
    this.id = props.id || randomUUID();
    this.destinyUrl = props.destinyUrl;
    this.userId = props.userId;
    this._clickNumber = props.clickNumber || 0;
    this.createdAt = props.createdAt || new Date();
    this.deletedAt = props.deletedAt;
    this.updatedAt = props.updatedAt;

    this.makeShortenedUrl(props.shortenedUrl);
  }

  public makeShortenedUrl(value?: string) {
    if (value) this._shortenedUrl = value;
    else {
      const { randomUUID } = new ShortUniqueId({
        length: 6,
      });
      this._shortenedUrl = `${process.env.HOST_URL}/${randomUUID()}`;
    }
  }

  public click() {
    this._clickNumber++;
  }

  public delete() {
    this.deletedAt = new Date();
  }

  get clickNumber() {
    return this._clickNumber;
  }

  get shortenedUrl() {
    return this._shortenedUrl;
  }
}
