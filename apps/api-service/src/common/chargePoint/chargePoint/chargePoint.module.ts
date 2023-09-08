import { ChargePointEntity } from '../../../../../../libs/entities/src/charger.entity';
import { ChargePointResolver } from './chargePoint.resolver';
import { ChargePointService } from './chargePoint.service';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

@Module({
  imports: [
    NestjsQueryTypeOrmModule.forFeature([ChargePointEntity], 'default'),
  ],
  providers: [ChargePointService, ChargePointResolver],
  exports: [
    NestjsQueryTypeOrmModule.forFeature([ChargePointEntity], 'default'),
  ],
})
export class ChargePointModule {}
