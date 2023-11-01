import { Field, InputType, ObjectType } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';

@ObjectType('ConnectorsOnMarkerResponse')
export class ConnectorsOnMarkerResponseDto {
  @Field()
  siteid: number;

  @Field(type => GraphQLJSON)
  location!: JSON;

  @Field({ nullable: true })
  available: number;

  @Field({ nullable: true })
  total: number;
}

@ObjectType('SiteResponse')
export class SiteResponseDto {
  @Field({ nullable: true })
  connector_type: string;

  @Field({ nullable: true })
  power: number;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  site_name: string;

  @Field({ nullable: true })
  site_address: string;

  @Field({ nullable: true })
  available: number;

  @Field(() => [Number], { nullable: true })
  available_ids: number[];

  @Field({ nullable: true })
  total: number;
}

@ObjectType('ChargingProgressResponse')
export class ChargingProgressResponseDto {
  @Field({ nullable: true })
  transactionId?: number;

  @Field({ nullable: true })
  power_usage?: number;

  @Field({ nullable: true })
  power_spend?: number;

  @Field({ nullable: true })
  battery?: number;
}

@InputType()
@ObjectType('InputFilterMarkers')
export class InputFilterMarkersDto {
  @Field(type => GraphQLJSON)
  connectorTypesSelected: JSON;

  @Field({ nullable: true })
  minPower: number;

  @Field({ nullable: true })
  maxPower: number;

  @Field({ nullable: true })
  minPrice: number;

  @Field({ nullable: true })
  maxPrice: number;
}

@InputType()
@ObjectType('InputFilterSite')
export class InputFilterSiteDto {
  @Field({ nullable: true })
  siteId: number;

  @Field(type => GraphQLJSON)
  connectorTypesSelected?: JSON;

  // @Field((type) => GraphQLJSON)
  // connectorStatusSelected: JSON;

  @Field({ nullable: true })
  minPower?: number;

  @Field({ nullable: true })
  maxPower?: number;

  @Field({ nullable: true })
  minPrice?: number;

  @Field({ nullable: true })
  maxPrice?: number;
}

@InputType()
@ObjectType('InputFilterChargingProgress')
export class InputFilterChargingProgressDto {
  @Field({ nullable: true })
  connectorId: number;

  @Field({ nullable: true })
  userId: number;
}

@InputType()
@ObjectType('SubscribeConnectorStatusInput')
export class SubscribeConnectorStatusInputDto {
  @Field({ nullable: true })
  connectorId: number;
}

@ObjectType('SubscribeConnectorStatusResponse')
export class SubscribeConnectorStatusResponseDto {
  @Field({ nullable: true })
  status?: string;
}
