import { ChargingHistoryResolver } from './charging-history.resolver';
import { ChargingHistoryService } from './charging-history.service';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { SessionHistoryEntity } from '../../../../../libs/entities/src/charging-history.entity';

@Module({
  imports: [NestjsQueryTypeOrmModule.forFeature([SessionHistoryEntity])],
  providers: [ChargingHistoryResolver, ChargingHistoryService],
  exports: [NestjsQueryTypeOrmModule.forFeature([SessionHistoryEntity])],
})
export class ChargingHistoryModule {}
