import { Injectable, OnModuleInit } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { grpcOcppClientOptions } from '../grpc-client-config/ocpp-grpc-client';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { ChargePointEntity,ConnectorEntity } from '@app/entities';
import { MapsApiResolver } from '../../common/maps-api/maps-api.resolver';
import { ocpp } from '../../../../../proto/ocpp';

const pubSub = new PubSub();

@Injectable()
export class OCPPService implements OnModuleInit {
  constructor(
    // private eventEmitter: EventEmitter2
    @InjectRepository(ChargePointEntity)
    private readonly chargePointEntityRepository: Repository<ChargePointEntity>,
    @InjectRepository(ConnectorEntity)
    private readonly connectorEntityRepository: Repository<ConnectorEntity>,
    @InjectQueryService(ConnectorEntity)
    private connectorQueryService: QueryService<ConnectorEntity>,
    private readonly mapsApiResolver: MapsApiResolver,
  ) {}

  receiptIds = [];

  public ocppService: ocpp.OcppService;

  @Client(grpcOcppClientOptions)
  private readonly clientOcpp: ClientGrpc;
  // private readonly ocppEvent;
  onModuleInit() {
    this.ocppService =
      this.clientOcpp.getService<ocpp.OcppService>('OcppService');
    console.log(`The module has been initialized.`);

    const ocppEvent = this.ocppService.logEventSream({});
    ocppEvent.subscribe((e) => {
      this.distributorEvenst(e.event);
      console.log('WWWWWWWWWWWWWWWWWWWWWWWWWW', e.event);
    });
  }

  async runStartTransactionByUser(payload): Promise<any> {
    const runSubscribe = await this.ocppService.remoteStartTransaction(payload);

    return new Promise((resolve, reject) => {
      runSubscribe.subscribe(resolve);
    });
  }

  async runStopTransactionByUser(payload): Promise<any> {
    const runSubscribe = await this.ocppService.remoteStopTransaction(payload);
    return new Promise((resolve, reject) => {
      runSubscribe.subscribe(resolve);
    });
  }

  async checkConnect(): Promise<any> {
    // subscribe.subscribe((e) => {
    //   console.log('WWWWWWWWWWWWWWWWWWWWWWWWWW', e.event);
    // });

    return;
  }

  newEventChargeProgress(data) {
    this.mapsApiResolver.pubBookingProgressUpdated(data);
  }

  newEvent(data) {
    // const  {chargeBoxId,action, params} =  data;
    // console.log(data);
    this.distributorEvenst(data);
  }

  distributorEvenst(jsondata) {
    const data = JSON.parse(jsondata);
    console.log('DATASSSSSSSS', data);
    switch (data.method) {
      case 'BootNotification':
        this.stationConnect(data);
        break;
      case 'disconnect':
        this.stationDisconnect(data);
        break;
      case 'Heartbeat':
        this.stationConnect(data);
        break;
      case 'StatusNotification':
        this.stationStatusNotification(data);
        break;

      default:
        break;
    }
  }

  async stationConnect(data) {
    const chargePoint = await this.chargePointEntityRepository.findOneBy({
      chargePointHardwareId: data.chargeBoxId,
    });
    console.log(chargePoint);
    if (chargePoint == undefined) return;
    chargePoint.status = 'Connected';

    return await this.chargePointEntityRepository.save(chargePoint);
  }

  async stationDisconnect(data) {
    const chargePoint = await this.chargePointEntityRepository.findOneBy({
      chargePointHardwareId: data.chargeBoxId,
    });
    if (chargePoint == undefined) return;
    chargePoint.status = 'Disconnected';
    return await this.chargePointEntityRepository.save(chargePoint);
  }

  async stationStatusNotification(data) {
    console.log(
      '22222222222222222222222222222222222222222222222222',
      data.params.connectorId,
      data.chargeBoxId,
    );

    const [connector] = await this.connectorEntityRepository.query(
      `select * from "Connector" c where 
      c."chargePointId" = (select id from "ChargePoint" cp 
      where cp."chargePointHardwareId"=$1) and c."connectorId" = $2`,
      [data.chargeBoxId, data.params.connectorId],
    );

    console.log(
      '33333333333333333333333333333333333333333333333333333333333',
      connector,
    );
    // const connector = await this.connectorEntityRepository.findOneBy({
    //   connectorId: data.params.connectorId,
    //   chargePointHardwareId: data.chargeBoxId,
    // });
    if (!connector) return;
    const connectorUpdated = await this.connectorQueryService
      .updateOne(connector.id, {
        statusName: data.params.status,
      })
      .then((e) => {
        this.mapsApiResolver.pubMarkerUpdated(connector.siteId);
        return e;
      });
    console.log(
      'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
      connectorUpdated,
    );
 
    // connector.statusName = data.params.status;

    // return await this.connectorEntityRepository.save(connector).then((e) => {
    //   this.mapsApiResolver.pubMarkerUpdated(connector.siteId);
    //   return e;
    // });
    return connectorUpdated;
  }

  // async createStartFunctionEvent(data: any): Promise<void> {
  //   data.args = JSON.parse(data.args);
  //   this.eventEmitter
  //     .emitAsync('start-near-function.' + data.method, data)
  //     .then((message) => console.log(message));
  // }

  // async createResultFunctionEvent(data: any): Promise<void> {
  //   //console.log('create result event:', data);
  //   await this.eventEmitter
  //     .emitAsync('result-near-function.' + data.method, data)
  //     .then((message) => console.log(message));
  // }

  async queryConnectorFetch(hargePointHardwareId, connectorId) {
    const queryCreateConnector = JSON.stringify({
      query: `query{
        connectors(filter:{chargePointHardwareId:{eq:"${hargePointHardwareId}"},connectorId:{eq:${connectorId}}}){
          id
        }
      }`,
    });
    const response = await fetch('http://35.236.79.246:3012/graphql', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: queryCreateConnector,
    });
    const responseJson = await response.json();
    // console.log(responseJson);
    return responseJson.data;
  }

  async updateConnectorFetch(connectorId, status) {
    const queryCreateConnector = JSON.stringify({
      query: `mutation{
        updateOneConnector(input:{id:${connectorId},update:{statusName:"${status}"}}){
          id
        }
      }`,
    });
    const response = await fetch('http://35.236.79.246:3012/graphql', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: queryCreateConnector,
    });
    const responseJson = await response.json();
    console.log(responseJson);
    return responseJson.data;
  }
}
