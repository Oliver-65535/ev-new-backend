import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CurrentJwtUser } from '../../decorators';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../../../auth/auth.interfaces';
import { ChargePointService } from './chargePoint.service';
import {
  CheckChargerIdExistInputDto,
  CheckChargerIdExistResponseDto,
} from './dto/chargePoint.resolver.dto';

@Resolver()
export class ChargePointResolver {
  constructor(private readonly chargePointService: ChargePointService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => CheckChargerIdExistResponseDto)
  async checkChargerIdExist(
    @Args('input') input: CheckChargerIdExistInputDto,
    @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<CheckChargerIdExistResponseDto> {
    return this.chargePointService.checkChargerIdExist(input.chargerId);
  }
}
