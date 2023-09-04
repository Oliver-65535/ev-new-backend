import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { UserModule } from '@app/user/user.module';
import { postgresConfiguration } from '@app/configuration';
import { Bootstrappable } from '@app/bootstrap';
import { JwtCustomModule } from 'libs/jwt/jwt.module';
import { AuthWalletController } from './auth-wallet.controller';
import { AuthWalletModule } from '@app/auth-wallet';

@Bootstrappable('auth')
@Module({
  imports: [
    TypeOrmModule.forRoot(postgresConfiguration),
    UserModule,
    JwtCustomModule,
    AuthWalletModule
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController, AuthWalletController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
