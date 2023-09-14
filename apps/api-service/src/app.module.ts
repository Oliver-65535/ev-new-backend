import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BillingChannelModule } from './billing-channel/billing-channel.module';
import { ChargePointModule } from './common/chargePoint/chargePoint/chargePoint.module';
import { ChargingHistoryModule } from './billing-channel/charging-history/charging-history.module';
import { ConfigModule } from '@nestjs/config';
import { ConnectorModule } from './common/chargePoint/connector/connector.module';
import { CustomSiteGraphQLModule } from './common/custom-site-graphql/custom-site-graphql.module';
import { GraphQLModule } from '@nestjs/graphql';
// import { GraphqlChargingHistoryModule } from './billing-channel/charging-history/charging-history-graphql/charging-history-graphql.module';
import { GraphqlConnectorModule } from './common/chargePoint/connector/connector-graphql/connector-graphql.module';
import { GraphqlOrganizationModule } from './common/organization/organization-graphql/organization-graphql.module';
import { GraphqlSiteModule } from './common/site/site/site-graphql/site-graphql.module';
import { GraphqlUserModule } from './common/user/user-graphql/user-graphql.module';
import { GraphqlChargePointModule } from './common/chargePoint/chargePoint/chargePoint-graphql.module';
import { MapsApiModule } from './common/maps-api/maps-api.module';
import { Module } from '@nestjs/common';
import { OCPPModule } from './modules-microservices/ocpp-cs-service/ocpp-cs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './common/user/user.module';
import { postgresConfiguration } from '@app/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(postgresConfiguration),
    // TypeOrmModule.forRoot(ormconfig[1]),
    GraphQLModule.forRoot({
      // set to true to automatically generate schema
      debug: false,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    GraphqlSiteModule,
    GraphqlChargePointModule,
    GraphqlConnectorModule,
    GraphqlUserModule,
    // GraphqlChargingHistoryModule,
    GraphqlOrganizationModule,
    CustomSiteGraphQLModule,
    // UserModule,
    AuthModule,
    MapsApiModule,
    OCPPModule,
    BillingChannelModule,
    ChargingHistoryModule,
    ChargePointModule,
    ConnectorModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
