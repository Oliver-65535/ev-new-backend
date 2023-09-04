import { ArticleApiController } from './article-api.controller';
import { ArticleApiService } from './article-api.service';
import { ArticleModule } from 'libs/articles/src/articles.module';
import { Bootstrappable } from '@app/bootstrap';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OpenPGPModule } from 'libs/openpgp/src/openpgp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfiguration } from '@app/configuration';

@Bootstrappable('articleApi')
@Module({
  imports: [
    TypeOrmModule.forRoot(postgresConfiguration),
    ArticleModule,
    OpenPGPModule,
    HttpModule,
  ],
  providers: [ArticleApiService],
  controllers: [ArticleApiController],
  exports: [ArticleApiService],
})
export class ArticleApiModule {}
