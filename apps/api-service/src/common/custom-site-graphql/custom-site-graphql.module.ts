import { ChargePointEntity } from '../chargePoint/chargePoint/chargePoint.entity';
import { ConnectorEntity } from '../chargePoint/connector/connector.entity';
import { CustomSiteGraphQLResolver } from './custom-site-graphql.resolver';
import { CustomSiteGraphQLService } from './custom-site-graphql.service';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { SiteEntity } from '../site/site/site.entity';

// import { StationModule } from '../chargePoint/chargePoint/chargePoint.module';

@Module({
  imports: [
    // StationModule,
    NestjsQueryTypeOrmModule.forFeature(
      [SiteEntity, ChargePointEntity, ConnectorEntity],
      'default',
    ),
  ],
  providers: [CustomSiteGraphQLService, CustomSiteGraphQLResolver],
  exports: [CustomSiteGraphQLService, CustomSiteGraphQLResolver],
})
export class CustomSiteGraphQLModule {}
