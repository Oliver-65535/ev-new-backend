import { Controller, Get } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RedisContext,
  Ctx,
} from '@nestjs/microservices';

import { SessionHistoryService } from './session-history.service';

@Controller('session')
export class SessionHistoryController {
  constructor(private readonly sessionHistoryService: SessionHistoryService) {}

  @Get()
  handleGet(data: any) {
    return this.sessionHistoryService.sessionStart(data);
  }

  @MessagePattern('api-billing-channel')
  getNotifications(@Payload() data: any, @Ctx() context: RedisContext) {
    console.log(`Channel: ${JSON.stringify(context)},${JSON.stringify(data)}`);
    return 'asdasdasd';
  }
}
