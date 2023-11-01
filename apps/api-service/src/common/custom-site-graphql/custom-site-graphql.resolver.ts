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

import {
  CustomDeleteOrganizationInput,
  CustomDeleteOrganizationResponse,
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CustomDeleteOrganizationResponse)
  async deleteOrganization(
    @Args('input') input: CustomDeleteOrganizationInput,
    @CurrentJwtUser() user: AuthenticatedUser,
    // @Context() context: any,
  ): Promise<CustomDeleteOrganizationResponse> {
    return this.customSiteGraphQLService.customDeleteOrganization(
      input,
      user.id,
    );
  }
}
