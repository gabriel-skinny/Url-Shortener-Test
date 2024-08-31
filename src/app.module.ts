import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';
import { ServiceModule } from './infra/services/services.module';
import { ThrottlerModule, minutes } from '@nestjs/throttler';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ServiceModule,
    ThrottlerModule.forRoot([
      {
        ttl: 100,
        limit: 100,
        blockDuration: minutes(1),
      },
      {
        ttl: 1000,
        limit: 1000,
        blockDuration: minutes(5),
      },
      {
        ttl: 10000,
        limit: 10000,
        blockDuration: minutes(15),
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
