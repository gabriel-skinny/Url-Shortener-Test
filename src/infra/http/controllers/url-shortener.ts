import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateShortUrlUseCase } from 'src/application/use-cases/url-shortener/create';
import { DeleteUrlUseCase } from 'src/application/use-cases/url-shortener/delete';
import { GetUrlsByUserIdUseCase } from 'src/application/use-cases/url-shortener/get-urls-by-user-id';
import { RedirectUseCase } from 'src/application/use-cases/url-shortener/redirect';
import { UpdateUrlUseCase } from 'src/application/use-cases/url-shortener/update';
import { BaseControllerReturn } from 'src/infra/interfaces/baseController';
import { CreateUrlDTO, DeleteUrlDTO, UpdateUrlDTO } from '../dto/url';
import { IUrlViewModel, UrlViewModel } from '../view-models/url';

@Controller('url')
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateShortUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
    private readonly getUrlsByUserIdUseCase: GetUrlsByUserIdUseCase,
    private readonly redirectUseCase: RedirectUseCase,
    private readonly updateUseCase: UpdateUrlUseCase,
  ) {}

  @Post()
  async create(
    @Body() { destinyUrl, userId }: CreateUrlDTO,
  ): Promise<BaseControllerReturn<{ shortednedUrl: string }>> {
    const { shortednedUrl } = await this.createUrlUseCase.execute({
      destinyUrl,
      userId,
    });

    return {
      message: 'Url created',
      data: { shortednedUrl },
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post(':urlValue')
  async redirect(@Param('urlValue') urlValue: string, @Res() res: Response) {
    const { desitinyUrl } = await this.redirectUseCase.execute({
      shortenedUrl: urlValue,
    });

    res.redirect(desitinyUrl);
  }

  @Delete()
  async delete(
    @Body() { urlId, userId }: DeleteUrlDTO,
  ): Promise<BaseControllerReturn> {
    await this.deleteUrlUseCase.execute({ urlId, userId });

    return {
      statusCode: HttpStatus.OK,
      message: 'Url deleted sucessfully',
    };
  }

  @Patch()
  async update(
    @Body() { newDestinyUrl, urlId, userId }: UpdateUrlDTO,
  ): Promise<BaseControllerReturn> {
    await this.updateUseCase.execute({
      newDestinyUrl,
      urlId,
      userId,
    });

    return {
      message: 'Url updated sucessfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('many/:id')
  async getUrlsByUserId(
    @Param('id') id: string,
  ): Promise<BaseControllerReturn<{ urls: IUrlViewModel[] }>> {
    const urls = await this.getUrlsByUserIdUseCase.execute({ userId: id });

    return {
      message: 'User urls',
      statusCode: HttpStatus.OK,
      data: { urls: urls.map(UrlViewModel.toHttp) },
    };
  }
}
