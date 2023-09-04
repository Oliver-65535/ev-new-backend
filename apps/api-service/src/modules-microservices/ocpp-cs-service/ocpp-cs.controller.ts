import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { OCPPService } from './ocpp-cs.service';

@Controller('subscribe')
export class OCPPController {
  constructor(private readonly subscribeService: OCPPService) {}
  @EventPattern('ocpp-server-channel')
  handleBookCreatedEvent(data: any) {
    console.log(data);
    this.subscribeService.newEvent(data);
  }

  @EventPattern('billing-api-channel')
  handleBillingChannel(data: any) {
    console.log(data);
    this.subscribeService.newEventChargeProgress(data);
  }

  @Get('client1')
  find1(): Promise<any> {
    return this.subscribeService.checkConnect();
  }
}
