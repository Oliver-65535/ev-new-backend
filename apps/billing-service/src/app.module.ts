import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingModule } from './billing/billing.module';
import { ConfigModule } from '@nestjs/config';
import { EnergyMeterModule } from './energy-meter/energy-meter.module';
import { GrpcAdapterModule } from './grpc-server/grpc-server.module';
import { InfluxDbModule } from './influx-db/influx-db.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionHistoryModule } from './session-history/session-history.module';
import { SessionMetricModule } from './common/statistics/session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// import ormconfig = require('../ormconfig');

// # Database
const DATABASE_HOST = '34.94.253.188';
// # DATABASE_HOST="localhost"
const DATABASE_PORT = 5440;
const DATABASE_USERNAME = 'ev-database-user';
const DATABASE_PASSWORD = 'ev-database-password';
const DATABASE_NAME = 'ev-database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      autoLoadEntities: true,
      // synchronize: true,
    }),
    ScheduleModule.forRoot(),
    BillingModule,
    GrpcAdapterModule,
    EnergyMeterModule,
    SessionMetricModule,
    InfluxDbModule,
    SessionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
