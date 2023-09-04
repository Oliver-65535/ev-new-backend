import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { sendFile } from '@app/common';
import { ArticleEntity } from '@app/entities';
import { ArticlesService } from 'libs/articles/src/articles.service';
import { CCreateArticleRecord } from './dto/create-article.dto';
import { HttpService } from '@nestjs/axios/dist';
import { IGraph } from '@app/entities/interfaces';
import { OpenPGPService } from 'libs/openpgp/src/openpgp.service';
import { articleConf } from '@app/configuration';

@Injectable()
export class ProfileService {
  constructor(
    private readonly articleService: ArticlesService,
    private readonly openPGPService: OpenPGPService,
    private readonly httpService: HttpService,
  ) {}

  private baseDir = join(__dirname, '..', '..', '..', 'tmp');

  async updateGraph(id: number, graph: IGraph): Promise<ArticleEntity> {
    return await this.articleService.changeGraph(id, graph);
  }

  async getGraph(id: number): Promise<ArticleEntity> {
    return await this.articleService.getById(id);
  }

  getServerPublicKey(): String {
    return this.openPGPService.getServerPublicKey();
  }

  async createArticle(
    file: any,
    data: CCreateArticleRecord,
  ): Promise<ArticleEntity> {
    const createdArticle = await this.articleService.create(data);
    const storedArticleUrl = await sendFile(
      `${articleConf.fileStoreUrl}${createdArticle.id}`,
      file.path,
    );
    const decryptedFilePath = await this.openPGPService.decryptFile({
      filePath: file.path,
    });

    // const graphData = await sendFile(
    //   `${articleConf.aiServiceUrl}${createdArticle.id}`,
    //   decryptedFilePath,
    // );

    // const article = await this.articleService.changeGraph(
    //   createdArticle.id,
    //   graphData,
    // );

    // require('fs').rmdir(file.destination, { recursive: true }, err => {});

    return createdArticle;
  }

  async articleAddUser() {
    // await this.openPGPService.reencryptFile(input);
  }

  async searchByKeyWords() {
    return await this.articleService.findByKeyWord()
  }
}
