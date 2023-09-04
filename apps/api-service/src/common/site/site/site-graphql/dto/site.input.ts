import {
  BeforeCreateMany,
  BeforeCreateOne,
  CreateManyInputType,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';
import { Geometry, Point } from 'geojson';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

import GraphQLJSON from 'graphql-type-json';
import { UserContext } from 'src/auth/auth.interfaces';

@InputType('SiteInput')
@BeforeCreateOne(
  (input: CreateOneInputType<SiteInputDTO>, context: UserContext) => {
    const { user } = context.req;
    // eslint-disable-next-line no-param-reassign
    return {
      input: { ...input.input, ownerId: user.id },
    };
  },
)
@BeforeCreateMany(
  (input: CreateManyInputType<SiteInputDTO>, context: UserContext) => {
    const createdBy = context.req.user.username;
    const ownerId = context.req.user.id;
    // eslint-disable-next-line no-param-reassign
    input.input = input.input.map((c) => ({ ...c, ownerId }));
    return input;
  },
)
export class SiteInputDTO {
  @Field()
  name!: string;

  @Field()
  site!: string;

  @Field()
  site_area!: string;

  @Field((type) => GraphQLJSON)
  location: JSON;

  @Field()
  address!: string;

  @Field()
  zip_code!: number;

  @Field()
  phone_number!: string;

  @Field()
  default_price: number;

  @Field()
  information!: string;

  @Field()
  dynamic_asset: string;

  @Field()
  asset_type!: string;

  @Field()
  instant_power!: number;

  @Field()
  battery!: string;

  ownerId: number;
}
