import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ocpp } from '../../../../proto/ocpp';

export class ChangeConfigurationRequestDto
  implements ocpp.ChangeConfigurationRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsString()
  @MaxLength(128)
  public readonly key: string;

  @IsString()
  @MaxLength(128)
  public readonly value: string;
}

export class ClearCacheRequestDto implements ocpp.ClearCacheRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;
}

export class GetDiagnosticsRequestDto implements ocpp.GetDiagnosticsRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsString()
  @MaxLength(128)
  public readonly location: string;
}

export class RemoteStartTransactionRequestDto
  implements ocpp.RemoteStartTransactionRequest
{
  @IsString()
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsString()
  public readonly idTag: string;

  // @IsString()
  // @MaxLength(128)
  // public readonly transactionId: string;

  // @IsString()
  // @MaxLength(128)
  // public readonly reservationId: string;
}

export class RemoteStopTransactionRequestDto
  implements ocpp.RemoteStopTransactionRequest
{
  @IsString()
  public readonly chargePointId: string;

  @IsNumber()
  public readonly transactionId: number;
}

export class ResetRequestDto implements ocpp.ResetRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  @Max(2)
  public readonly type: number;
}

export class UnlockConnectorRequestDto implements ocpp.UnlockConnectorRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  @Max(32)
  public readonly type: number;
}

export class ReserveNowRequestDto implements ocpp.ReserveNowRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly connectorId: number;

  @IsString()
  @MaxLength(128)
  public readonly expiryDate: string;

  @IsString()
  @MaxLength(128)
  public readonly idTag: string;

  @IsNumber()
  public readonly reservationId: number;
}

export class CancelReservationRequestDto
  implements ocpp.CancelReservationRequest
{
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsNumber()
  public readonly reservationId: number;
}

export class DataTransferRequestDto implements ocpp.DataTransferRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsString()
  @MaxLength(128)
  public readonly vendorId: string;

  @IsString()
  @MaxLength(128)
  public readonly messageId: string;

  @IsString()
  @MaxLength(8000)
  public readonly data: string;
}

export class GetConfigurationRequestDto
  implements ocpp.GetConfigurationRequest
{
  @IsString()
  public readonly chargePointId: string;

  @IsArray()
  public readonly key: string[];
}

export class GetLocalListVersionRequestDto
  implements ocpp.GetLocalListVersionRequest
{
  @IsString()
  public readonly chargePointId: string;
}

export class SendLocalListRequestDto implements ocpp.SendLocalListRequest {
  @IsString()
  public readonly chargePointId: string;

  @IsNumber()
  public readonly listVersion: number;

  @IsArray()
  public readonly localAuthorizationList: ocpp.LocalAuthorizationListType[];
}

export class TriggerMessageRequestDto implements ocpp.TriggerMessageRequest {
  @IsString()
  @MaxLength(128)
  public readonly chargePointId: string;

  @IsString()
  public readonly requestedMessage: string;

  @IsNumber()
  public readonly connectorId: number;
}
