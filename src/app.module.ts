import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';
import { ServiceModule } from './infra/services/services.module';

@Module({
  imports: [DatabaseModule, HttpModule, ServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
