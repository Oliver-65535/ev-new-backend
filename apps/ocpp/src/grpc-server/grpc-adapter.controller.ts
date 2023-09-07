import {
  AUTH_SERVICE_NAME,
  OCPP_SERVICE_NAME,
  protobufPackage,
} from '../../src/config/grpc';
import {
  CancelReservationRequestDto,
  ChangeConfigurationRequestDto,
  ClearCacheRequestDto,
  DataTransferRequestDto,
  GetConfigurationRequestDto,
  GetDiagnosticsRequestDto,
  GetLocalListVersionRequestDto,
  RemoteStartTransactionRequestDto,
  RemoteStopTransactionRequestDto,
  ReserveNowRequestDto,
  ResetRequestDto,
  SendLocalListRequestDto,
  TriggerMessageRequestDto,
  UnlockConnectorRequestDto,
} from '../dto/ocpp.dto';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { OcppTaskService } from '../ocpp-cs/ocpp-server/ocpp/ocpp-task.service';
import { logSubject } from '../ocpp-cs/ocpp-server/ocpp/ocpp-handlers.service';
import { MethodCall as mc } from '@app/common';
import { ocpp } from '../../../../proto/ocpp';
import { taskSubject } from '../ocpp-cs/ocpp-server/ocpp/ocpp-task.service';


const timeSubject = new Subject<{ event: string }>();
setInterval(() => {
  const event = 'Ленинградское время 00 часов 00 минут :)';
  timeSubject.next({ event });
}, 1000);

@Controller()
export class GrpcAdapterController {
  @Inject(OcppTaskService)
  private readonly ocppTaskService: OcppTaskService;

  @GrpcMethod(OCPP_SERVICE_NAME, 'LogEventSream')
  public getLogEventSream(): Observable<{ event: string }> {
    console.log('LogEventSream call !!!');
    return logSubject.asObservable();
  }

  @GrpcMethod(OCPP_SERVICE_NAME, 'TaskEventSream')
  public getTaskEventSream(): Observable<{ tasks: string }> {
    console.log('TaskEventSream call !!!');
    return taskSubject.asObservable();
  }

  @GrpcMethod(OCPP_SERVICE_NAME, 'GetTimeStream')
  public getTimeStream(): Observable<{ event: string }> {
    console.log('GetTimeStream call !!!');
    return timeSubject.asObservable();
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.ChangeConfiguration)
  private changeConfiguration(
    payload: ChangeConfigurationRequestDto,
  ): Promise<ocpp.ChangeConfigurationResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.ChangeConfiguration,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.ClearCache)
  private clearCache(
    payload: ClearCacheRequestDto,
  ): Promise<ocpp.ClearCacheResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.ClearCache,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.GetDiagnostics)
  private getDiagnostics(
    payload: GetDiagnosticsRequestDto,
  ): Promise<ocpp.GetDiagnosticsResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.GetDiagnostics,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.RemoteStartTransaction)
  private remoteStartTransaction(
    payload: RemoteStartTransactionRequestDto,
  ): Promise<ocpp.RemoteStartTransactionResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.RemoteStartTransaction,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.RemoteStopTransaction)
  private remoteStopTransaction(
    payload: RemoteStopTransactionRequestDto,
  ): Promise<ocpp.RemoteStopTransactionResponse> {
    console.log(payload);
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.RemoteStopTransaction,
      ...this.toParams(payload),
    });
    // return { status: HttpStatus.OK, error: null };
    // return this.service.validate(payload);
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.Reset)
  private reset(payload: ResetRequestDto): Promise<ocpp.ResetResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.Reset,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.UnlockConnector)
  private unlockConnector(
    payload: UnlockConnectorRequestDto,
  ): Promise<ocpp.UnlockConnectorResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.UnlockConnector,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.ReserveNow)
  private reserveNow(
    payload: ReserveNowRequestDto,
  ): Promise<ocpp.ReserveNowResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.ReserveNow,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.CancelReservation)
  private cancelReservation(
    payload: CancelReservationRequestDto,
  ): Promise<ocpp.CancelReservationResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.CancelReservation,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.DataTransfer)
  private dataTransfer(
    payload: DataTransferRequestDto,
  ): Promise<ocpp.DataTransferResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.DataTransfer,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.GetConfiguration)
  private GetConfiguration(
    payload: GetConfigurationRequestDto,
  ): Promise<ocpp.GetConfigurationResponse> {
    // console.log(payload)
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.GetConfiguration,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.GetLocalListVersion)
  private getLocalListVersion(
    payload: GetLocalListVersionRequestDto,
  ): Promise<ocpp.GetLocalListVersionResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.GetLocalListVersion,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.SendLocalList)
  private sendLocalList(
    payload: SendLocalListRequestDto,
  ): Promise<ocpp.SendLocalListResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.SendLocalList,
      ...this.toParams(payload),
    });
  }

  @GrpcMethod(OCPP_SERVICE_NAME, mc.TriggerMessage)
  private triggerMessage(
    payload: TriggerMessageRequestDto,
  ): Promise<ocpp.TriggerMessageResponse> {
    return this.ocppTaskService.runTaskCall({
      methodCall: mc.TriggerMessage,
      ...this.toParams(payload),
    });
  }

  toParams(payload) {
    const chargePointId = payload.chargePointId;
    delete payload.chargePointId;
    console.log(payload);
    console.log({ chargePoinId: payload });
    return { chargePointId, params: payload };
  }
}
