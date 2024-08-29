import { Url } from "src/application/entities/Url";
import { UrlEntity } from "../entities/url";

export const urlEntityToRaw = (url: UrlEntity) => {
    return new Url({
        id: url.id,
        destinyUrl: url.destinyUrl,
        userId: url.userId,
        clickNumber: url.clickNumber,
        createdAt: url.createdAt,
        deletedAt: url.deletedAt,
        updatedAt: url.updatedAt,
    })
}