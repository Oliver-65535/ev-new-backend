import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { UserEntity } from '../../../../../libs/entities/src/user.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity], 'default')],
  providers: [UserResolver],
  exports: [NestjsQueryTypeOrmModule.forFeature([UserEntity], 'default')],
})
export class UserModule {}
