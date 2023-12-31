import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CChangeGraph } from './dto';
import { CCreateArticleRecord, CCreateArticleRequest } from './dto/create-article.dto';
import { FILE_INTERCEPTOR } from './profile.interceptors';

@Controller('profile')
export class ProfileController {
  constructor(private readonly articleService: ProfileService) {}

  @Post('change-graph')
  async changeGraph(@Body() body: CChangeGraph) {
    return await this.articleService.updateGraph(body.id, body.graph);
  }

  @Get('get-graph/:id')
  async getGraph(@Param('id') query: string) {
    return await this.articleService.getGraph(+query);
  }

  @Get('get-server-public-key')
  getServerPublicKey() {
    return this.articleService.getServerPublicKey();
  }

  @Post('create-article')
  @UseInterceptors(FILE_INTERCEPTOR)
  async createArticle(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CCreateArticleRecord,
  ) {
    return await this.articleService.createArticle(file, body);
  }

  @Post('search-by-key-words')
  async searchByKeyWords() {
    return await this.articleService.searchByKeyWords()
  }
}
