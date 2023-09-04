import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  FilterableField,
  FilterableOffsetConnection,
  FilterableUnPagedRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
  Relation,
} from '@nestjs-query/query-graphql';

import GraphQLJSON from 'graphql-type-json';

@ObjectType('ChargingHistory')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class ChargingHistoryDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ nullable: true })
  transactionId?: string;

  @FilterableField({ nullable: true })
  chargePointHardwareId: string;

  @FilterableField({ nullable: true })
  connectorId?: number;

  @FilterableField({ nullable: true })
  userId?: number;

  @FilterableField({ nullable: true })
  meterStart: number;

  @FilterableField({ nullable: true })
  meterStop: number;

  @FilterableField({ nullable: true })
  session_start: Date; // Creation date

  @FilterableField({ nullable: true })
  session_end: Date; // Creation date
}
