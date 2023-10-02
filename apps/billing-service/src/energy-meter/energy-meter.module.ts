import { EnergyMeterService } from './energy-meter.service';
import { Module } from '@nestjs/common';
import { SessionHistoryModule } from '../session-history/session-history.module';
import { UserEntity } from '@app/entities';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

@Module({
  imports: [
    SessionHistoryModule,
    NestjsQueryTypeOrmModule.forFeature([UserEntity], 'default'),
  ],
  providers: [EnergyMeterService],
  exports: [EnergyMeterService],
})
export class EnergyMeterModule {}
