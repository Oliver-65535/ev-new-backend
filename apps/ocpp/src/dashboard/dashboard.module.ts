import { DasboardController } from './dasboard.controller';
import { Module } from '@nestjs/common';
import { OcppServicesModule } from '../ocpp-cs/ocpp-server/ocpp/ocpp-cs.module';

@Module({
  imports: [OcppServicesModule],
  controllers: [DasboardController],
  providers: [],
})
export class DashboardModule {}
