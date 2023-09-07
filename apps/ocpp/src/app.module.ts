import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigModule } from '@nestjs/config';
import { GrpcAdapterModule } from '../src/grpc-server/grpc-server.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Module } from '@nestjs/common';
import { OcppServerModule } from './ocpp-cs/ocpp-server/ocpp-cs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    OcppServerModule,
    GrpcAdapterModule,
    DashboardModule
  ],
})
export class AppModule {}
