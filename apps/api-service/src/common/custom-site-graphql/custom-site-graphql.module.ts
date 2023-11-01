import { ChargePointEntity } from '../../../../../libs/entities/src/charger.entity';
import { ConnectorEntity } from '../../../../../libs/entities/src/connector.entity';
import { CustomSiteGraphQLResolver } from './custom-site-graphql.resolver';
import { CustomSiteGraphQLService } from './custom-site-graphql.service';
import { MapsApiModule } from '../maps-api/maps-api.module';
import { Module } from '@nestjs/common';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { OrganizationEntity } from '@app/entities';
import { SiteEntity } from '@app/entities';

// import { StationModule } from '../chargePoint/chargePoint/chargePoint.module';

@Module({
  imports: [
    // StationModule,
    NestjsQueryTypeOrmModule.forFeature(
      [SiteEntity, ChargePointEntity, ConnectorEntity, OrganizationEntity],
      'default',
    ),
    MapsApiModule,
  ],
  providers: [CustomSiteGraphQLService, CustomSiteGraphQLResolver],
  exports: [CustomSiteGraphQLService, CustomSiteGraphQLResolver],
})
export class CustomSiteGraphQLModule {}
