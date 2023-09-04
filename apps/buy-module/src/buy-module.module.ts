import { Bootstrappable } from '@app/bootstrap';
import { BuyModuleController } from './buy-module.controller';
import { BuyModuleService } from './buy-module.service';
import { Module } from '@nestjs/common';

@Bootstrappable('buyModule')
@Module({
  imports: [],
  controllers: [BuyModuleController],
  providers: [BuyModuleService],
})
export class BuyModule {}
