import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUrlDTO {
  @IsString()
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

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class UpdateUrlDTO {
  @IsString()
  @IsNotEmpty()
  newDestinyUrl: string;

  @IsUUID()
  @IsNotEmpty()
  urlId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
