import { BILLING_SERVICE_NAME } from '../config/grpc';
import {
  TransactionStartedRequestDto,
  PaymentReceivedRequestDto,
  RunStartTransactionRequestDto,
  RunStopTransactionRequestDto,
} from './dto/billing.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { EnergyMeterService } from '../energy-meter/energy-meter.service';

// import { OcppTaskService } from 'src/billing-cs/billing-server/billing/billing-task.service';

// import { MethodCall as mc } from 'src/enums/method.enum';
import { billing } from '../../../../proto/billing';

@Controller()
export class GrpcAdapterController {
  // @Inject(OcppTaskService)
  // private readonly billingTaskService: OcppTaskService;

  constructor(private readonly energyMeterService: EnergyMeterService) {}

  @GrpcMethod(BILLING_SERVICE_NAME, 'TransactionStarted')
  private async transactionStarted(
    payload: TransactionStartedRequestDto,
  ): Promise<billing.TransactionStartedResponse> {
    return this.energyMeterService.getTransactionId(payload);
  }

  @GrpcMethod(BILLING_SERVICE_NAME, 'RunStartTransaction')
  private async runStartTransaction(
    payload: RunStartTransactionRequestDto,
  ): Promise<billing.TransactionStartedResponse> {
    return this.energyMeterService.runStartTransaction(payload);
  }

  @GrpcMethod(BILLING_SERVICE_NAME, 'RunStopTransaction')
  private async runStopTransaction(
    payload: RunStartTransactionRequestDto,
  ): Promise<billing.TransactionStartedResponse> {
    return this.energyMeterService.runStopTransaction(payload);
  }

  @GrpcMethod(BILLING_SERVICE_NAME, 'PaymentReceived')
  private async paymentReceived(
    payload: RunStartTransactionRequestDto,
  ): Promise<billing.TransactionStartedResponse> {
    return this.energyMeterService.paymentReceived(payload);
  }

  toParams(payload) {
    const chargePointId = payload.chargePointId;
    delete payload.chargePointId;
    console.log(payload);
    console.log({ chargePoinId: payload });
    return { chargePointId, params: payload };
  }
}
