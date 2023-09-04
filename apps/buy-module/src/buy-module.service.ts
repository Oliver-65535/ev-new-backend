import { ArticlesService } from '@app/articles/articles.service';
import { Injectable } from '@nestjs/common';
import { CreateRequest } from './dto/request-access.dto';
import { ApproveRequest } from './dto/approve-request.dto';

@Injectable()
export class BuyModuleService {
  constructor(private readonly articlesService: ArticlesService) {}

  public async requestAccess(data: CreateRequest) {
    return await this.articlesService.createRequest(data);
  }

  public async viewRequests(ownerId: number) {
    return await this.articlesService.viewRequests(ownerId);
  }

  public async approveRequest(data: ApproveRequest) {
    return await this.articlesService.approveRequest(
      data.articleId,
      data.isApprove,
    );
  }
}
