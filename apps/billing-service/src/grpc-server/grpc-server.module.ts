import { GrpcAdapterController } from './grpc-adapter.controller';
import { Module } from '@nestjs/common';
import { EnergyMeterModule } from '../energy-meter/energy-meter.module';


@Module({
  imports: [EnergyMeterModule],
  controllers: [GrpcAdapterController],
  providers: [],
})
export class GrpcAdapterModule {}
