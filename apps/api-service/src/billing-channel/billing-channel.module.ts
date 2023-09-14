import { Module } from '@nestjs/common';
import { BillingChannelController } from './billing-channel.controller';
import { BillingChannelService } from './billing-channel.service';
import { BillingChannelResolver } from './billing-channel.resolver';
import { ChargingHistoryModule } from './charging-history/charging-history.module';

@Module({
  imports:[ChargingHistoryModule],
  controllers: [BillingChannelController],
  providers: [BillingChannelService, BillingChannelResolver]
})
export class BillingChannelModule {}
