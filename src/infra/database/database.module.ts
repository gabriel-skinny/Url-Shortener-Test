import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AbstractShortUrlRepository } from 'src/application/repositories/shortUrlRepository';
import { AbstractUserRepository } from 'src/application/repositories/userRepository';
import { UrlEntity } from './entities/url';
import { UserEntity } from './entities/user';
import { UrlRepository } from './repositories/urlRepository';
import { UserRepository } from './repositories/userRepository';
import { AbstractCacheService } from 'src/application/services/cache';
import Redis from 'ioredis';
import { CacheService } from './cache/cacheService';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [UrlEntity, UserEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UrlEntity, UserEntity]),
  ],
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractShortUrlRepository,
      useClass: UrlRepository,
    },
    {
      provide: AbstractCacheService,
      useFactory: () => {
        const redisConfig = new Redis(
          Number(process.env.REDIS_PORT),
          process.env.REDIS_HOST,
        );

        return new CacheService(redisConfig);
      },
    },
  ],
  exports: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractShortUrlRepository,
      useClass: UrlRepository,
    },
    {
      provide: AbstractCacheService,
      useFactory: () => {
        const redisConfig = new Redis(
          Number(process.env.REDIS_PORT),
          process.env.REDIS_HOST,
        );

        return new CacheService(redisConfig);
      },
    },
  ],
})
export class DatabaseModule {}
