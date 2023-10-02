import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { EnergyMeterModule } from '../energy-meter/energy-meter.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnergyMeterModule],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}
