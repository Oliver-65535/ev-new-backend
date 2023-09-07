import { GrpcAdapterController } from './grpc-adapter.controller';
import { Module } from '@nestjs/common';
import { OcppServicesModule } from '../ocpp-cs/ocpp-server/ocpp/ocpp-cs.module';

@Module({
  imports: [OcppServicesModule],
  controllers: [GrpcAdapterController],
  providers: [],
})
export class GrpcAdapterModule {}
