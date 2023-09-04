import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, UserEntity } from '@app/entities';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
