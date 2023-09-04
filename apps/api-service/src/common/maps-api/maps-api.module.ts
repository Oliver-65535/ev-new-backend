import { ChargePointModule } from '../chargePoint/chargePoint/chargePoint.module';
import { ConnectorEntity } from '../chargePoint/connector/connector.entity';
import { MapsApiResolver } from './maps-api.resolver';
import { MapsApiService } from './maps-api.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ChargePointModule, TypeOrmModule.forFeature([ConnectorEntity])],
  providers: [MapsApiService, MapsApiResolver],
  exports: [MapsApiService, MapsApiResolver],
})
export class MapsApiModule {}
