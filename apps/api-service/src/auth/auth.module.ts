import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailerModule } from 'libs/mailer/src';
import { MessageBirdModule } from 'libs/SMS/messagebird/message-bird.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RedisCustomModule } from 'libs/redis/redis.module';
import { UserModule } from '../common/user/user.module';
import { jwtConfig } from '@app/configuration';
import { jwtConstants } from './auth.constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RedisCustomModule,
    MessageBirdModule,
    MailerModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConfig.accessTokenExpire },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
