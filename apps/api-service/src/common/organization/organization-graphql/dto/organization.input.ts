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
import { UserContext } from '../../../../auth/auth.interfaces';

@InputType('OrganizationInput')
@BeforeCreateOne(
  (input: CreateOneInputType<OrganizationInputDTO>, context: UserContext) => {
    const { user } = context.req;
    // eslint-disable-next-line no-param-reassign
    return {
      input: { ...input.input, ownerId: user.id },
    };
  },
)
@BeforeCreateMany(
  (input: CreateManyInputType<OrganizationInputDTO>, context: UserContext) => {
    const createdBy = context.req.user.username;
    const ownerId = context.req.user.id;
    // eslint-disable-next-line no-param-reassign
    input.input = input.input.map((c) => ({ ...c, ownerId }));
    return input;
  },
)
export class OrganizationInputDTO {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  phone_number!: string;

  @Field((type) => GraphQLJSON, { nullable: true })
  location: Point;

  @Field()
  address: string;

  @Field()
  zip_code!: number;

  ownerId!: number;
}
