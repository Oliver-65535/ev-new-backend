import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { redisConfig } from '@app/configuration';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({ config: redisConfig }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCustomModule {}
