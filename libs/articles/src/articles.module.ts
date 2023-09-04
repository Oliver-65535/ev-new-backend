import { ArticleEntity, UserEntity } from '@app/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { UserModule } from '@app/user/user.module';
import { ArticleAccessEntity } from '@app/entities/access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, ArticleAccessEntity]), UserModule],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticleModule {}
