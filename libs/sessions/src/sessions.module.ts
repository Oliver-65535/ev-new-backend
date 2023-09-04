import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from '@app/sessions/services';
import { IpDetectionService } from '@app/sessions/services';
import { IpGeolocationService } from '@app/sessions/services';
import { UserAgentParserService } from '@app/sessions/services';
import { RedisCustomModule } from '../../redis/redis.module';
import { RedisService } from '../../redis/redis.service';
import { JwtCustomModule } from '../../jwt/jwt.module';
import { SessionEntity } from '@app/entities/session.entity';
import { UserEntity } from '@app/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, UserEntity]),
    RedisCustomModule,
    JwtCustomModule,
  ],
  providers: [
    RedisService,
    SessionsService,
    IpDetectionService,
    IpGeolocationService,
    UserAgentParserService,
  ],
  exports: [
    SessionsService,
    IpDetectionService,
    IpGeolocationService,
    UserAgentParserService,
  ],
})
export class SessionsModule {}
