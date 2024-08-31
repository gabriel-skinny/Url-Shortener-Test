import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { CustomExceptionFilter } from './infra/http/filters/httpException';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import ClusterService from './infra/cluster/cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Encurtador de Url')
    .setDescription('Uma api que encurta qualquer url')
    .setVersion('1.0')
    .addTag('urlShortener')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

ClusterService.clusterize(bootstrap);
