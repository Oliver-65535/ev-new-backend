import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentJwtUser } from '../../common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { ChargingHistoryDTO } from './charging-history-graphql/dto/charging-history.dto';
import {
  ChargingHistoryInputDTO,
  ChargerChargingHistoryInputDTO,
  ChargingHistoryResponseDTO,
} from './charging-history-graphql/dto/charging-history.input';
import { ChargingHistoryService } from './charging-history.service';

interface HistoryType {
  count: number;
  data: [ChargingHistoryDTO];
}

@Resolver()
export class ChargingHistoryResolver {
  constructor(
    private readonly chargingHistoryService: ChargingHistoryService,
  ) {} // private authService: AuthService

  @UseGuards(JwtAuthGuard)
  @Query(() => ChargingHistoryResponseDTO)
  async userChargingHistory(
    @Args('input') input: ChargingHistoryInputDTO,
    @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<ChargingHistoryDTO[]> {
    return this.chargingHistoryService.getChargingHistory({
      ...input,
      userId: jwtUser.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ChargingHistoryDTO])
  async connectorChargingHistory(
    @Args('input') input: ChargerChargingHistoryInputDTO,
    @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<ChargingHistoryDTO[]> {
    return this.chargingHistoryService.getChargingHistory(input);
  }
}
