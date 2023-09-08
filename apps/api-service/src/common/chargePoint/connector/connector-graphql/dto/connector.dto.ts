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

import { ChargePointDTO } from '../../../../../common/chargePoint/chargePoint/dto/chargePoint.dto';
import { SiteDTO } from '../../../../../common/site/site/site-graphql/dto/site.dto';
import { UserContext } from '../../../../../auth/auth.interfaces';

@ObjectType('Connector')
@Authorize({
  authorize: (context: UserContext) => ({
    ownerId: { eq: context.req.user.id },
  }),
})
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
@FilterableUnPagedRelation('chargePoint', () => ChargePointDTO, {
  disableRemove: true,
})
@FilterableUnPagedRelation('site', () => SiteDTO, { disableRemove: true })
export class ConnectorDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ nullable: true })
  label: string;

  @FilterableField({ nullable: true })
  connectorId!: number;

  @FilterableField({ nullable: true })
  chargePointHardwareId!: string;

  @FilterableField({ nullable: true })
  connectorTypeName: string;

  @FilterableField({ nullable: true })
  connectorTypeId: string;

  @FilterableField({ nullable: true })
  statusId: number;

  @FilterableField({ nullable: true })
  statusName: string;

  @FilterableField({ nullable: true })
  information: string;

  @FilterableField({ nullable: true })
  instantPower: number;

  @FilterableField({ nullable: true })
  power: number;

  @FilterableField({ nullable: true })
  maxPower: number;

  @FilterableField({ nullable: true })
  price: number;

  @FilterableField({ nullable: true })
  priceUnit: string;

  @FilterableField({ nullable: true })
  consumption: number;

  @FilterableField({ nullable: true })
  inactivity: number;

  @FilterableField({ nullable: true })
  created_at: Date; // Creation date

  @FilterableField({ nullable: true })
  updated_at: Date; // Last updated date

  @FilterableField({ nullable: true })
  deleted_at: Date; // Deletion date

  @Field({ nullable: true })
  chargePointId?: number;

  @Field()
  siteId?: number;

  ownerId: number;
}
