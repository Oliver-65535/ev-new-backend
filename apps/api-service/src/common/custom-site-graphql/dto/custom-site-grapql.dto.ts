import { Field, InputType, ObjectType } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';

@InputType()
@ObjectType('CustomSiteCreateInput')
export class CustomSiteCreateInputDto {
  @Field(type => GraphQLJSON)
  data?: JSON;
}

@ObjectType('CustomSiteCreateResponse')
export class CustomSiteCreateResponseDto {
  @Field({ nullable: true })
  siteId: number;
}

@InputType()
@ObjectType('CustomDeleteOrganizationInput')
export class CustomDeleteOrganizationInput {
  @Field({ nullable: true })
  organizationId: number;
}

@ObjectType('CustomDeleteOrganizationResponse')
export class CustomDeleteOrganizationResponse {
  @Field({ nullable: true })
  deletedCount: number;
}
