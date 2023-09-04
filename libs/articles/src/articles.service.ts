import { ArticleEntity, UserEntity } from '@app/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ICreateArticleRecord } from './interface';
import { IGraph } from '@app/entities/interfaces';
import { UserService } from '@app/user/user.service';
import { ArticleAccessEntity } from '@app/entities/access.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    
    // private readonly articleAccessRepository: Repository<ArticleAccessEntity>,
    private readonly userRepository: UserService,
    @InjectRepository(ArticleAccessEntity)
    private readonly requestRepository: Repository<ArticleAccessEntity>,
  ) {}

  async create(data: ICreateArticleRecord): Promise<ArticleEntity> {
    const { ownerId, ...articleData } = data;
    const user: UserEntity = await this.userRepository.findById(data.ownerId);

    const newArticle: ArticleEntity = this.articleRepository.create({
      owner: user,
      ...articleData,
    });

    return await this.articleRepository.save(newArticle);
  }

  async findByKeyWord() {
    const searchHead = 'intermolecular interaction';
    const searchHeads = [
      'intermolecular interaction',
      'another search term',
      'yet another term',
    ];
    const tokens = await this.articleRepository
      .createQueryBuilder('article')
      .where(
        "element->>'head' IN (:...words)" +
          'FROM jsonb_array_elements(article.graph) AS element',
      )
      .setParameters({
        searchHeads,
      })
      /* 
        this is a test variant. Works, but search only by one word, not array. 
      */
      //   ":searchHead = ANY (SELECT (element->>'head')::text FROM jsonb_array_elements(article.graph) AS element)",
      // )
      // .setParameter('searchHead', searchHead)
      .getMany();

    console.log(tokens);
  }

  async changeGraph(id: number, newGraph: IGraph): Promise<ArticleEntity> {
    const updatedArticle: ArticleEntity = await this.articleRepository.findOne({
      where: { id },
    });

    updatedArticle.graph = newGraph;

    return await this.articleRepository.save(updatedArticle);
  }

  async getById(id: number): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { id } });
  }

  async createRequest(request: any) {
    const { articleId, requesterId, ownerId } = request;
    const article: ArticleEntity = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    const user: UserEntity = await this.userRepository.findById(requesterId);

    const newRequest = this.requestRepository.create({
      article,
      requester: user,
      ownerId,
    });

    return await this.requestRepository.save(newRequest);
  }

  async viewRequests(ownerId: number) {
    return await this.requestRepository.find({ where: { ownerId } });
  }

  async approveRequest(id: number, isApprove: boolean) {
    const request = await this.requestRepository.findOne({ where: { id } });
    request.approve = isApprove;

    if (isApprove) {
      const article = await this.articleRepository.findOne({
        where: { id: request.article.id },
      });
      article.buyers = article.buyers
        ? [...article.buyers, request.requester]
        : [request.requester];

      await this.articleRepository.save(article);
    }

    return await this.requestRepository.save(request);
  }
}
