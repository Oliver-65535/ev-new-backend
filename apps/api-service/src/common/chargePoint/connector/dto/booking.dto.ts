import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { ConnectorEntity } from '../connector.entity';
import { billing } from 'src/proto/billing';

@ObjectType('BookingResponse')
export class BookingResponseDto {
  @Field({ nullable: true })
  status?: string;
}

@InputType()
@ObjectType('BookingInput')
export class BookingInputDto {
  @Field({ nullable: true })
  id: number;

  //   @Field({ nullable: true })
  //   maxPower: number;

  //   @Field({ nullable: true })
  //   minPrice: number;

  //   @Field({ nullable: true })
  //   maxPrice: number;
}

@InputType()
@ObjectType('TransactionByUserInput')
export class TransactionByUserInputDTO {
  @Field({ nullable: true })
  id: number;
}

@ObjectType('TransactionByUserResponse')
export class TransactionByUserResponseDTO
  implements billing.RunStartTransactionResponse
{
  @Field({ nullable: true })
  status?: billing.Status;
}