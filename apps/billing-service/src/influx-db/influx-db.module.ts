import { InfluxDbService } from './influx-db.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [InfluxDbService],
  exports: [InfluxDbService],
})
export class InfluxDbModule {}
