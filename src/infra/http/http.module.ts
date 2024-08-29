import { Module } from '@nestjs/common';
import { UserController } from './controllers/user';
import { UrlController } from './controllers/url-shortener';
import { CreateShortUrlUseCase } from 'src/application/use-cases/url-shortener/create';
import { DeleteUrlUseCase } from 'src/application/use-cases/url-shortener/delete';
import { GetUrlsByUserIdUseCase } from 'src/application/use-cases/url-shortener/get-urls-by-user-id';
import { RedirectUseCase } from 'src/application/use-cases/url-shortener/redirect';
import { UpdateUrlUseCase } from 'src/application/use-cases/url-shortener/update';
import { CreateUserUseCase } from 'src/application/use-cases/user/create';
import { LoginUseCase } from 'src/application/use-cases/user/login';
import { DatabaseModule } from '../database/database.module';
import { ServiceModule } from '../services/services.module';
import {
  AbstractUserExistsByIdUseCase,
  UserExistsByIdUseCase,
} from 'src/application/use-cases/user/exists-by-id';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    CreateShortUrlUseCase,
    DeleteUrlUseCase,
    GetUrlsByUserIdUseCase,
    RedirectUseCase,
    UpdateUrlUseCase,
    CreateUserUseCase,
    LoginUseCase,
    { provide: AbstractUserExistsByIdUseCase, useClass: UserExistsByIdUseCase },
  ],
  controllers: [UserController, UrlController],
})
export class HttpModule {}
