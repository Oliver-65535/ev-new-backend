import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { CurrentJwtUser } from '../../decorators';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../../../auth/auth.interfaces';
import { ConnectorService } from './connector.service';

import {
  BookingInputDto,
  BookingResponseDto,
  TransactionByUserInputDTO,
  TransactionByUserResponseDTO,
} from './dto/booking.dto';
import {
  ChargingProgressResponseDto,
  InputFilterChargingProgressDto,
  SubscribeConnectorStatusInputDto,
  SubscribeConnectorStatusResponseDto,
} from '../../../common/maps-api/dto/getConnectors.dto';

import { pubSub } from '../../../common/maps-api/maps-api.resolver';

export const eventSubsribeConnectorStatus = data =>
  pubSub.publish('subsribeConnectorStatus', { subsribeConnectorStatus: data });

type Status = {
  status: string;
};

@Resolver()
export class ConnectorResolver {
  constructor(private readonly connectorService: ConnectorService) {}

  @Mutation(() => BookingResponseDto)
  // @UseGuards(GqlAuthGuard)
  async bookConnector(
    @Args('input') input: BookingInputDto,
    // @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const status = await this.connectorService.bookedConnector(input.id);
    return status;
  }

  @Mutation(() => BookingResponseDto)
  // @UseGuards(GqlAuthGuard)
  async cancelBookConnector(
    @Args('input') input: BookingInputDto,
    // @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const status = await this.connectorService.cancelBookConnector(input.id);

    return status;
  }

  @Mutation(() => BookingResponseDto)
  // @UseGuards(GqlAuthGuard)
  async softBookConnector(
    @Args('input') input: BookingInputDto,
    // @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<BookingResponseDto> {
    const connector = await this.connectorService.bookedConnector(input.id);

    return { status: 'Reserved' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TransactionByUserResponseDTO)
  async startTransactionByUser(
    @Args('input') input: TransactionByUserInputDTO,
    @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<TransactionByUserResponseDTO> {
    // console.log(jwtUser);
    const transaction = await this.connectorService.runStartTransaction(
      input.id,
      jwtUser.id,
    );

    // const transaction = await this.ocppService.runStartTransactionByUser(
    //   input.id,
    //   jwtUser.id,
    // );

    return { status: 'Accepted' };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => TransactionByUserResponseDTO)
  async stopTransactionByUser(
    @Args('input') input: TransactionByUserInputDTO,
    @CurrentJwtUser() jwtUser: AuthenticatedUser,
  ): Promise<TransactionByUserResponseDTO> {
    // console.log(jwtUser);
    const transaction = await this.connectorService.runStopTransaction(
      input.id,
      jwtUser.id,
    );

    return { status: 'Accepted' };
  }

  //SUBSCRIBE CHARGE PROGRESS
  @Subscription(() => ChargingProgressResponseDto, {
    name: 'chargingProgressUpdated',
    // filter: (payload, variables) => {
    //   console.log('FILTER', { payload, variables });
    //   return payload.connectorId === variables.input.connectorId;
    // },
    // resolve(this: ConnectorResolver, payload, variables) {
    //   // "this" refers to an instance of "AuthorResolver"
    //   console.log(payload, variables);
    //   return payload;
    // },
  })
  private chargingProgressUpdated(
    @Args('input') input: InputFilterChargingProgressDto,
  ) {
    return pubSub.asyncIterator('chargingProgressUpdated');
  }

  //SUBSCRIBE CONNECTOR STATUS
  @Subscription(() => SubscribeConnectorStatusResponseDto, {
    name: 'subsribeConnectorStatus',
    filter: (payload, variables) => {
      console.log('FILTER', { payload, variables });
      return payload.subsribeConnectorStatus.id === variables.input.connectorId;
    },
    // resolve(this: ConnectorResolver, payload, variables) {
    //   // "this" refers to an instance of "AuthorResolver"
    //   console.log(payload, variables);
    //   return payload;
    // },
  })
  private subsribeConnectorStatus(
    @Args('input') input: SubscribeConnectorStatusInputDto,
  ) {
    return pubSub.asyncIterator('subsribeConnectorStatus');
  }
}
