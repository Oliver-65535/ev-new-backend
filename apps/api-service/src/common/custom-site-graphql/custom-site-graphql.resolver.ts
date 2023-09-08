import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../../auth/auth.interfaces';
import { CurrentJwtUser } from '../decorators';
// import {
//   BookingProgressResponseDto,
//   ConnectorsOnMarkerResponseDto,
//   InputFilterBookingProgressDto,
//   InputFilterMarkersDto,
//   InputFilterSiteDto,
//   SiteResponseDto,
// } from './dto/getConnectors.dto';

import {
  CustomSiteCreateInputDto,
  CustomSiteCreateResponseDto,
} from './dto/custom-site-grapql.dto';

import { CustomSiteGraphQLService } from './custom-site-graphql.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class CustomSiteGraphQLResolver {
  constructor(private customSiteGraphQLService: CustomSiteGraphQLService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CustomSiteCreateResponseDto)
  async createOrUpdateSiteWithChargePoints(
    @Args('input') input: CustomSiteCreateInputDto,
    @CurrentJwtUser() user: AuthenticatedUser,
    // @Context() context: any,
  ): Promise<CustomSiteCreateResponseDto> {
    return this.customSiteGraphQLService.createOrUpdateSiteWithChargePoints(
      input,
      user,
    );
  }

  // @Mutation(() => CustomSiteCreateResponseDto)
  // async updateSiteWithChargepoints(
  //   @Args('input') input: CustomSiteCreateInputDto,
  // ): Promise<CustomSiteCreateResponseDto> {
  //   return this.customSiteGraphQLService.createSiteWithChargePoints(input);
  // }
  // async getRandomMessage(
  //   @Args('input') input: RandomMessageInputDTO,
  // ): Promise<RandomMessageResponseDTO> {
  //   const msgString = this.authService.generateString(128);
  //   return { msg: msgString };
  // }

  // @Query(() => [ConnectorsOnMarkerResponseDto])
  // getFilteredMarkers(
  //   @Args('input') input: InputFilterMarkersDto,
  // ): Promise<markerType[]> {
  //   const res = this.mapsApiService.getFilteredMarkers(input);
  //   //console.log('ME', 'asd', res);
  //   return res;
  // }

  // @Query(() => [SiteResponseDto])
  // getFilteredSite(
  //   @Args('input') input: InputFilterSiteDto,
  // ): Promise<siteType[]> {
  //   const res = this.mapsApiService.getFilteredSite(input);
  //   return res;
  // }

  // //SUBSCRIBE SITE
  // @Subscription(() => [SiteResponseDto], {
  //   name: 'siteUpdated',
  //   filter: (payload, variables) => {
  //     // console.log('FILTER', { payload, variables });
  //     return payload.siteId === variables.input.siteId;
  //   },
  //   resolve(this: MapsApiResolver, payload, variables) {
  //     // "this" refers to an instance of "AuthorResolver"
  //     return this.getUpdatedSite(variables);
  //   },
  // })
  // private siteUpdated(@Args('input') input: InputFilterSiteDto) {
  //   return pubSub.asyncIterator('siteUpdated');
  // }

  // //SUBSCRIBE Markers
  // @Subscription(() => [ConnectorsOnMarkerResponseDto], {
  //   name: 'markerUpdated',
  //   resolve(this: MapsApiResolver, payload, variables) {
  //     // "this" refers to an instance of "AuthorResolver"
  //     return this.getUpdatedMarker({ ...variables });
  //   },
  // })
  // private markerUpdated(@Args('input') input: InputFilterMarkersDto) {
  //   return pubSub.asyncIterator('markerUpdated');
  // }

  // //SUBSCRIBE CHARGE PROGRESS
  // @Subscription(() => BookingProgressResponseDto, {
  //   name: 'bookingProgressUpdated',
  //   // filter: (payload, variables) => {
  //   //   // console.log('FILTER', { payload, variables });
  //   //   return payload.siteId === variables.input.siteId;
  //   // },
  //   // resolve(this: MapsApiResolver, payload, variables) {
  //   //   // "this" refers to an instance of "AuthorResolver"
  //   //   console.log(payload, variables);
  //   //   return payload;
  //   // },
  // })
  // private bookingProgressUpdated(
  //   @Args('input') input: InputFilterBookingProgressDto,
  // ) {
  //   return pubSub.asyncIterator('bookingProgressUpdated');
  // }

  // private async getUpdatedSite(variables) {
  //   return await this.mapsApiService.getFilteredSite(variables.input);
  // }

  // private async getUpdatedMarker(variables) {
  //   console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', variables);
  //   return await this.mapsApiService.getFilteredMarkers(variables.input);
  // }

  // public pubBookingProgressUpdated(data: any) {
  //   console.log(data);
  //   pubSub.publish('bookingProgressUpdated', { bookingProgressUpdated: data });
  // }

  // public pubMarkerUpdated(siteId: number) {
  //   console.log(siteId);
  //   pubSub.publish('markerUpdated', { siteId });
  //   pubSub.publish('siteUpdated', { siteId });
  // }

  // pubSiteUpdated() {
  //   console.log();
  //   pubSub.publish('siteUpdated', { minPrice: 200 });
  // }

  // @Mutation(() => RandomMessageResponseDTO)
  // sign(
  //   @CurrentUser() user: AuthenticatedUser,
  //   @Args('input') input: CertIDInputDTO,
  // ): Promise<UserAuthDTO> {
  //   console.log('asjdjasldjl', user, input);
  //   return this.certService.signCert(user, input);
  // }
}
