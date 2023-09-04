import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { JwtCustomService } from './jwt.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JwtCustomService],
  exports: [JwtCustomService],
})
export class JwtCustomModule {}
