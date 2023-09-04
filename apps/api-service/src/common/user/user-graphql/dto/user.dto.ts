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

@ObjectType('User')
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class UserDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ nullable: true })
  name: string;

  @FilterableField({ nullable: true })
  username: string;

  @FilterableField()
  phone: string;

  @FilterableField({ nullable: true })
  email: string;

  @FilterableField({ nullable: true })
  country: string;

  @FilterableField({ nullable: true })
  state: string;

  @FilterableField({ nullable: true })
  address: string;

  @FilterableField({ nullable: true })
  unit: string;

  @FilterableField({ nullable: true })
  city: string;

  @FilterableField({ nullable: true })
  zip: number;
}
