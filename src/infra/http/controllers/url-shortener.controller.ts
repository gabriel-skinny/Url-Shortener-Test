import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateShortUrlUseCase } from 'src/application/use-cases/url-shortener/create';
import { DeleteUrlUseCase } from 'src/application/use-cases/url-shortener/delete';
import { GetUrlsByUserIdUseCase } from 'src/application/use-cases/url-shortener/get-urls-by-user-id';
import { RedirectUseCase } from 'src/application/use-cases/url-shortener/redirect';
import { UpdateUrlUseCase } from 'src/application/use-cases/url-shortener/update';
import { BaseControllerReturn } from 'src/infra/interfaces/baseController';
import { ILoginTokenData } from 'src/infra/services/Auth';
import { ConditionalGuardByBearer } from '../decoretors/conditionalGuard';
import { CreateUrlDTO, UpdateUrlDTO } from '../dto/url.dto';
import { AuthGuard } from '../guards/Autentication';
import { IUrlViewModel, UrlViewModel } from '../view-models/url';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Url routes')
@Controller()
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateShortUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
    private readonly getUrlsByUserIdUseCase: GetUrlsByUserIdUseCase,
    private readonly redirectUseCase: RedirectUseCase,
    private readonly updateUseCase: UpdateUrlUseCase,
  ) {}

  @Post('url')
  @ConditionalGuardByBearer()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWTAuthorization')
  async create(
    @Body() { destinyUrl }: CreateUrlDTO,
    @Req() { user }: { user: ILoginTokenData },
  ): Promise<BaseControllerReturn<{ shortednedUrl: string }>> {
    const { shortednedUrl } = await this.createUrlUseCase.execute({
      destinyUrl,
      userId: user?.userId,
    });

    return {
      message: 'Url created',
      data: { shortednedUrl },
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get(':urlValue')
  async redirect(@Param('urlValue') urlValue: string, @Res() res: Response) {
    const { desitinyUrl } = await this.redirectUseCase.execute({
      shortenedUrlValue: urlValue,
    });

    res.redirect(desitinyUrl);
  }

  @UseGuards(AuthGuard)
  @Get('url/many')
  @ApiBearerAuth('JWTAuthorization')
  async getUrlsByUserId(
    @Req() { user }: { user: ILoginTokenData },
  ): Promise<BaseControllerReturn<{ urls: IUrlViewModel[] }>> {
    const urls = await this.getUrlsByUserIdUseCase.execute({
      userId: user.userId,
    });

    return {
      message: 'User urls',
      statusCode: HttpStatus.OK,
      data: { urls: urls.map(UrlViewModel.toHttp) },
    };
  }

  @UseGuards(AuthGuard)
  @Patch('url/:id')
  @ApiBearerAuth('JWTAuthorization')
  async update(
    @Req() { user }: { user: ILoginTokenData },
    @Body() { newDestinyUrl }: UpdateUrlDTO,
    @Param('id', ParseUUIDPipe) urlId: string,
  ): Promise<BaseControllerReturn> {
    await this.updateUseCase.execute({
      newDestinyUrl,
      urlId,
      userId: user.userId,
    });

    return {
      message: 'Url updated sucessfully',
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AuthGuard)
  @Delete('url/:id')
  @ApiBearerAuth('JWTAuthorization')
  async delete(
    @Param('id', ParseUUIDPipe) urlId: string,
    @Req() { user }: { user: ILoginTokenData },
  ): Promise<BaseControllerReturn> {
    await this.deleteUrlUseCase.execute({ userId: user.userId, urlId });

    return {
      statusCode: HttpStatus.OK,
      message: 'Url deleted sucessfully',
    };
  }
}
