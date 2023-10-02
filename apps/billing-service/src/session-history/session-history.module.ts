import { InfluxDbModule } from '../influx-db/influx-db.module';
import { Module } from '@nestjs/common';
import { SessionHistoryController } from './session-history.controller';
import { SessionHistoryEntity } from './session-history.entity';
import { SessionHistoryService } from './session-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SessionHistoryEntity]), InfluxDbModule],
  providers: [SessionHistoryService],
  // exports: [NestjsQueryTypeOrmModule.forFeature([SessionHistoryEntity])],
  controllers: [SessionHistoryController],
  exports: [SessionHistoryService],
})
export class SessionHistoryModule {}
