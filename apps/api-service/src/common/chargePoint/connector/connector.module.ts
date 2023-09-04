import { ConnectorEntity } from './connector.entity';
import { ConnectorResolver } from './connector.resolver';
import { ConnectorService } from './connector.service';
import { JwtModule } from '../../jwt/jwt.module';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { OCPPModule } from 'src/modules-microservices/ocpp-cs-service/ocpp-cs.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    NestjsQueryTypeOrmModule.forFeature([ConnectorEntity], 'default'),
    JwtModule,
    OCPPModule,
  ],
  exports: [NestjsQueryTypeOrmModule.forFeature([ConnectorEntity], 'default')],
  providers: [ConnectorService, ConnectorResolver, TasksService],
})
export class ConnectorModule {}
