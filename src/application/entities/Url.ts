import { randomUUID } from "crypto";

export interface IUrlProps {
    id?: string;
    destinyUrl: string;
    userId?: string;
    clickNumber?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Url {
    readonly id: string;
    readonly userId?: string;
    readonly createdAt: Date;
    public updatedAt?: Date;
    public destinyUrl: string;
    public deletedAt?: Date;
    private _clickNumber: number;
    private _shortenedUrl: string;

    constructor(props: IUrlProps) {
        this.id = props.id || randomUUID();
        this.destinyUrl = props.destinyUrl;
        this.userId = props.userId;
        this._clickNumber = props.clickNumber || 0;
        this.createdAt = props.createdAt || new Date();
        this.deletedAt = props.deletedAt;
        this.updatedAt = props.updatedAt;

        this.makeShortenedUrl();
    }

    public makeShortenedUrl() {
        this._shortenedUrl = `${process.env.HOST_URL}`
    }

    public click() {
        this._clickNumber++;
        this.updatedAt = new Date();
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