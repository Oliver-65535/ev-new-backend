import { ArticleEntity, UserEntity } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleAccessEntity } from '@app/entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleAccessEntity, ArticleEntity, UserEntity])],
  providers: [],
  exports: [],
})
export class ArticleModule {}
