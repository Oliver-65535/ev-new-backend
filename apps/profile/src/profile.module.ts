import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
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
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
