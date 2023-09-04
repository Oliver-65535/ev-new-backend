import { CacheModule, Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NonceTokenEntity,
  RefreshTokenEntity,
  UserEntity,
} from '@app/entities';
import { PasswordService } from './services/password.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { redisConfig } from '@app/configuration';
// import * as redisStore from 'cache-manager-redis-store';
import { RedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      NonceTokenEntity,
    ]),
    RedisModule.forRoot({
      config: {
        url: `redis://${redisConfig.host}:${redisConfig.port}`,
      },
    }),
    JwtModule.register({}),
    // CacheModule.register({
    //   store: redisStore,
    //   host: redisConfig.host,
    //   port: redisConfig.port,
    //   // password: redisConfig.password,
    //   ttl: 0,
    // }),
  ],
  providers: [AuthService, PasswordService, JwtAuthGuard],
  exports: [
    AuthService,
    PasswordService,
    JwtAuthGuard,
    JwtModule,
    TypeOrmModule,
    // CacheModule,
  ],
})
export class AuthWalletModule {}
