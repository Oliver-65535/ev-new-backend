import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { protobufPackage } from './config/grpc';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const microserviceRedis = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: {
  //     host: process.env.REDIS_HOST,
  //     port: Number(process.env.REDIS_PORT),
  //   },
  // });

  const microserviceGRPC: INestMicroservice = await app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50052',
        package: protobufPackage,
        protoPath: join(__dirname, '../proto/billing.proto'),
      },
    },
  );
app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.startAllMicroservices();
  await app.listen(Number(process.env.BACKEND_PORT));
}
bootstrap();
