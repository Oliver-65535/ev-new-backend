import {
  Authorize,
  FilterableField,
  FilterableOffsetConnection,
  FilterableUnPagedRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

import { ChargePointDTO } from '../../../../chargePoint/chargePoint/dto/chargePoint.dto';
import { ConnectorDTO } from '../../../../chargePoint/connector/connector-graphql/dto/connector.dto';
import GraphQLJSON from 'graphql-type-json';
import { UserContext } from '../../../../../auth/auth.interfaces';

@ObjectType('Site')
@Authorize({
  authorize: (context: UserContext) => ({
    ownerId: { eq: context.req.user.id },
  }),
})
@FilterableUnPagedRelation('chargePoint', () => ChargePointDTO, {
  disableRemove: true,
  // disableUpdate: true,
  // enableTotalCount: true,
})
@FilterableUnPagedRelation('connectors', () => ConnectorDTO, {
  disableRemove: true,
  // disableUpdate: true,
  // enableTotalCount: true,
})
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class SiteDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ nullable: true })
  name!: string;

  @FilterableField({ nullable: true })
  site!: string;

  @FilterableField({ nullable: true })
  site_area!: string;

  @FilterableField((type) => GraphQLJSON)
  location: JSON;

  @FilterableField({ nullable: true })
  address!: string;

  @FilterableField({ nullable: true })
  zip_code!: number;

  @FilterableField({ nullable: true })
  phone_number!: string;

  @FilterableField({ nullable: true })
  default_price: number;

  @FilterableField({ nullable: true })
  information!: string;

  @FilterableField({ nullable: true })
  dynamic_asset: string;

  @FilterableField({ nullable: true })
  asset_type!: string;

  @FilterableField({ nullable: true })
  instant_power!: number;

  @FilterableField({ nullable: false })
  battery!: string;

  @FilterableField({ nullable: true })
  organizationId?: number;

  @FilterableField({ nullable: true })
  ownerId: number;
}
