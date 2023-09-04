import { Module } from '@nestjs/common';
import { BillingChannelController } from './billing-channel.controller';
import { BillingChannelService } from './billing-channel.service';
import { BillingChannelResolver } from './billing-channel.resolver';

@Module({
  controllers: [BillingChannelController],
  providers: [BillingChannelService, BillingChannelResolver]
})
export class BillingChannelModule {}
