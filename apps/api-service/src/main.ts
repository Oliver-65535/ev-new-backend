import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
require('dotenv').config();
import { redisConfig } from '@app/configuration';

async function bootstrap() {
  const app2 = await NestFactory.create(AppModule);
  app2.enableCors();

  const microserviceRedis = app2.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  });

  await app2.startAllMicroservices();
  await app2.listen(3012);

}
bootstrap();
