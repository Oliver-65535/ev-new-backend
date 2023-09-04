import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CurrentJwtUser } from '../../decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/auth.interfaces';
import { ConnectorDTO } from './connector-graphql/dto/connector.dto';
import { ConnectorService } from './connector.service';
import { OCPPService } from 'src/modules-microservices/ocpp-cs-service/ocpp-cs.service';
import {
  BookingInputDto,
  BookingResponseDto,
  TransactionByUserInputDTO,
  TransactionByUserResponseDTO,
} from './dto/booking.dto';
import { ConnectorEntity } from './connector.entity';
import { billing } from 'src/proto/billing';

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

    return transaction.data;
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

    return transaction.data;
  }
}
