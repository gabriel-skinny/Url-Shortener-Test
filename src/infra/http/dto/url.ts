import { IsNotEmpty, IsOptional, IsUUID, IsUrl } from 'class-validator';

export class CreateUrlDTO {
  @IsUrl({
    protocols: ['http', 'https'],
    allow_protocol_relative_urls: false,
    require_protocol: true,
  })
  @IsNotEmpty()
  destinyUrl: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}

export class DeleteUrlDTO {
  @IsUUID()
  @IsNotEmpty()
  urlId: string;
}

export class UpdateUrlDTO {
  @IsUrl({
    protocols: ['http', 'https'],
    allow_protocol_relative_urls: false,
    require_protocol: true,
  })
  @IsNotEmpty()
  newDestinyUrl: string;
}
