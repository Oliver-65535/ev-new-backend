import { Field, InputType, ObjectType } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';

// @ObjectType('ConnectorsOnMarkerResponse')
// export class ConnectorsOnMarkerResponseDto {
//   @Field()
//   siteid: number;

//   @Field((type) => GraphQLJSON)
//   location!: JSON;

//   @Field({ nullable: true })
//   available: string;

//   @Field({ nullable: true })
//   total: string;
// }

@ObjectType('CustomSiteCreateResponse')
export class CustomSiteCreateResponseDto {
  // @Field({ nullable: true })
  // connector_type: string;

  @Field({ nullable: true })
  siteId: number;

  // @Field({ nullable: true })
  // price: number;

  // @Field({ nullable: true })
  // available: string;

  // @Field({ nullable: true })
  // total: string;
}

// @ObjectType('BookingProgressResponse')
// export class BookingProgressResponseDto {
//   @Field({ nullable: true })
//   transactionId?: number;

//   @Field({ nullable: true })
//   power_usage?: number;

//   @Field({ nullable: true })
//   power_spend?: number;

//   @Field({ nullable: true })
//   battery?: number;
// }

// @InputType()
// @ObjectType('InputFilterMarkers')
// export class InputFilterMarkersDto {
//   @Field((type) => GraphQLJSON)
//   connectorTypesSelected: JSON;

//   @Field({ nullable: true })
//   minPower: number;

//   @Field({ nullable: true })
//   maxPower: number;

//   @Field({ nullable: true })
//   minPrice: number;

//   @Field({ nullable: true })
//   maxPrice: number;
// }

@InputType()
@ObjectType('CustomSiteCreateInput')
export class CustomSiteCreateInputDto {
  // @Field({ nullable: true })
  // siteId: number;

  @Field((type) => GraphQLJSON)
  data?: JSON;

  // @Field((type) => GraphQLJSON)
  // connectorStatusSelected: JSON;

  // @Field({ nullable: true })
  // minPower?: number;

  // @Field({ nullable: true })
  // maxPower?: number;

  // @Field({ nullable: true })
  // minPrice?: number;

  // @Field({ nullable: true })
  // maxPrice?: number;
}

// @InputType()
// @ObjectType('InputFilterBookingProgress')
// export class InputFilterBookingProgressDto {
//   @Field({ nullable: true })
//   connectorId: number;

//   @Field({ nullable: true })
//   userId: number;
// }
