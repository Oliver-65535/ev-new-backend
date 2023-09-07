import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from "@app/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { protobufPackage } from '../src/config/grpc';

import { redisConfig } from '@app/configuration';
// import { OcppServerService } from './ocpp-cs/ocpp-server/ocpp-server.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log(redisConfig.port)

  const microserviceRedis = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  });

  const microserviceGRPC: INestMicroservice =
    await app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: protobufPackage,
        protoPath: join(__dirname, '../../../proto/ocpp.proto'),
      },
    });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');

  app.enableCors();
  await app.listen(3021);
  // const appService = app.get(OcppServerService).getStart();

  // await app.listen();
}
bootstrap();
