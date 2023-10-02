import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

import { billing } from '../../../../../proto/billing';

export class TransactionStartedRequestDto
  implements billing.TransactionStartedRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsString()
  public readonly idTag: string;
}

export class PaymentReceivedRequestDto
  implements billing.PaymentReceivedRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsNumber()
  public readonly userId: number;

  @IsNumber()
  public readonly amount: number;
}

export class RunStartTransactionRequestDto
  implements billing.RunStartTransactionRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsNumber()
  public readonly userId: number;

}

export class RunStopTransactionRequestDto
  implements billing.RunStopTransactionRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsNumber()
  public readonly userId: number;

}

