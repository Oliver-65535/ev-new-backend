import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BuyModuleService } from './buy-module.service';
import { CreateRequest } from './dto/request-access.dto';
import { ApproveRequest } from './dto/approve-request.dto';

@Controller('buy-module')
export class BuyModuleController {
  constructor(private readonly buyService: BuyModuleService) {}

  @Post('request-access')
  async requestAccess(@Body() body: CreateRequest) {
    return await this.buyService.requestAccess(body);
  }

  @Get('view-requests/:ownerId')
  async viewRequests(@Param('ownerId') id: string) {
    return await this.buyService.viewRequests(+id);
  }

  @Post('approve-request')
  async approveRequest(@Body() body: ApproveRequest) {
    return await this.buyService.approveRequest(body);
  }
}
