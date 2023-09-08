import { ConnectorEntity, ChargePointEntity} from '@app/entities'
import { MapsApiModule } from '../../common/maps-api/maps-api.module';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { OCPPController } from './ocpp-cs.controller';
import { OCPPService } from './ocpp-cs.service';

@Module({
  imports: [
    NestjsQueryTypeOrmModule.forFeature([ChargePointEntity]),
    NestjsQueryTypeOrmModule.forFeature([ConnectorEntity]),
    MapsApiModule,
  ],
  providers: [OCPPService],
  exports: [OCPPService /*TypeOrmModule*/],
  controllers: [OCPPController],
})
export class OCPPModule {}
