import {
  Authorize,
  FilterableField,
  FilterableOffsetConnection,
  FilterableUnPagedRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Geometry, Point } from 'geojson';

import GraphQLJSON from 'graphql-type-json';
import { SiteDTO } from 'src/common/site/site/site-graphql/dto/site.dto';
import { UserContext } from 'src/auth/auth.interfaces';

@ObjectType('Organization')
@Authorize({
  authorize: (context: UserContext) => ({
    ownerId: { eq: context.req.user.id },
  }),
})
@FilterableUnPagedRelation('Site', () => SiteDTO, {
  disableRemove: true,
  // disableUpdate: true,
  // enableTotalCount: true,
})
@QueryOptions({ pagingStrategy: PagingStrategies.NONE })
export class OrganizationDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField({ nullable: true })
  name!: string;

  @FilterableField({ nullable: true })
  email!: string;

  @FilterableField({ nullable: true })
  phone_number!: string;

  @FilterableField((type) => GraphQLJSON, { nullable: true })
  location: Point;

  @FilterableField({ nullable: true })
  address: string;

  @FilterableField({ nullable: true })
  zip_code!: number;

  @FilterableField({ nullable: true })
  created_at: Date; // Creation date

  @FilterableField({ nullable: true })
  updated_at: Date; // Last updated date

  ownerId: number;
}
