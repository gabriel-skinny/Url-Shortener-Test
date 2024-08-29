import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UrlEntity } from "./entities/url";
import { UserEntity } from "./entities/user";
import { UserRepository } from "./repositories/userRepository";
import { UrlRepository } from "./repositories/urlRepository";
import { AbstractShortUrlRepository } from "src/application/repositories/shortUrlRepository";
import { AbstractUserRepository } from "src/application/repositories/userRepository";


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
    ],
    providers: [UserRepository, UrlRepository],
    exports: [{
        provide: AbstractUserRepository,
        useClass: UserRepository
    }, {
        provide: AbstractShortUrlRepository,
        useClass: UrlRepository
    }]
})
export class DatabaseModule { }