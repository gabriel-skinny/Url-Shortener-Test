import { IUrlProps, Url } from 'src/application/entities/Url';

export const makeShortUrl = (props?: Partial<IUrlProps>) => {
  return new Url({
    destinyUrl: 'destinyUrl123',
    ...props,
  });
};
