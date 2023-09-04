import { Controller, Get } from '@nestjs/common';

import { BillingChannelService } from './billing-channel.service';

@Controller('billing-channel')
export class BillingChannelController {
  constructor(private readonly BillingChannelService: BillingChannelService) {}

  @Get()
  handleGet() {
    return this.BillingChannelService.publishEvent({ nn: 'fff' });
  }
}
