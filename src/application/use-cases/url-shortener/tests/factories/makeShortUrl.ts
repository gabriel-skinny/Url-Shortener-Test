import { IUrlProps, Url } from "src/application/entities/Url"
import { IUserProps, User } from "src/application/entities/User"

export const makeShortUrl = (props?: Partial<IUrlProps>) => {
    return new Url({
        destinyUrl: "destinyUrl123",
        ...props
    })
}