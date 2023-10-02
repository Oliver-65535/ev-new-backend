import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  handleGet(data: any) {
    return this.billingService.checkEnergyService();
  }

  // @Get()
  // handleGetTransactionId(data: any) {
  //   return this.billingService.transactionStarted(data);
  // }

  // @EventPattern('payment-channel')
  // handleBookCreatedEvent(data: any) {
  //   this.billingService.handlePaymentEvent(data);
  // }
}
