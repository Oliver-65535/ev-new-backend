import {
  Client,
  ClientGrpc,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { SessionHistoryService } from '../session-history/session-history.service';
import { grpcOcppClientOptions } from '../grpc-client-config/ocpp-grpc-client';
import { meterValueParser } from './parsers/meterValueParser';
import { UserEntity } from '@app/entities';
import { ocpp } from '../../../../proto/ocpp';
import { meter } from './meter1';

@Injectable()
export class EnergyMeterService implements OnModuleInit {
  redisClient: ClientProxy;
  chargeList = [];

  constructor(
    private readonly sessionHistoryService: SessionHistoryService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private ocppService: ocpp.OcppService;

  private sessionList = [];

  session = {
    chargePoint: null,
    connectorId: null,
    userId: null,
    transactionId: null,
    energy: null,
    price: null,
    timestampStart: null,
    timestampMeter: null,
    timestampStop: null,
  };

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
      // console.log('WWWWWWWWWWWWWWWWWWWWWWWWWW', e.event);
    });
  }

  private readonly logger = new Logger(EnergyMeterService.name);

  findSessionIndex(data) {
    return this.sessionList.findIndex((e) => {
      return data.connectorId
        ? e.connectorId == data.connectorId
        : 1 && data.transactionId
        ? e.transactionId == data.transactionId
        : 1 && e.chargePointId == data.chargePointId;
    });
  }

  async addBalance({ userId, amount }): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const updatedUser = await this.userRepository.update(
      { id: userId },
      { balance: user.balance + amount },
    );
    console.log('UPDATE BALANCE', { user, userId, amount, updatedUser });
    return updatedUser;
  }

  async takeBalance({ userId, amount }): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return this.userRepository.update(
      { id: userId },
      { balance: user.balance - amount },
    );
  }

  async getBalance({ userId }): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user.balance;
  }

  async getTransactionId(data): Promise<any> {
    // const index = this.findSessionIndex({
    //   chargePointId: data.chargePointId,
    //   connectorId: data.connectorId,
    // });
    // let transactionId = 1;
    // console.log(' getTransactionId(data)', data);
    // if (index >= 0) {
    //   const transaction = await this.sessionHistoryService.sessionStart({
    //     ...data,
    //     userId: this.sessionList[index].userId,
    //   });
    //   transactionId = transaction.id;
    //   if (index >= 0) this.sessionList[index].transactionId = transactionId;
    //   console.log('index', index, this.sessionList);
    // }
    // console.log(data);
    return await { httpStatus: 200, transactionId: 1, error: [] };
  }

  async runStartTransaction(data): Promise<any> {
    if ((await this.getBalance({ userId: data.userId })) < 0.5) {
      return await {
        httpStatus: 500,
        status: 'Rejected',
        error: ['Low balance'],
      };
    } else {
      // this.sessionList.push({ ...this.session, ...data });
      const transaction = await this.ocppService
        .remoteStartTransaction({
          chargePointId: data.chargePointId,
          connectorId: data.connectorId,
          idTag: data.userId,
        })
        .toPromise();

      console.log({ transaction });
      return transaction;
    }
  }

  async runStopTransaction(data): Promise<any> {
    // const index = this.findSessionIndex({
    //   chargePointId: data.chargePointId,
    //   connectorId: data.connectorId,
    // });

    // const transactionId = this.sessionList[index].transactionId;

    const transaction = await this.ocppService
      .remoteStopTransaction({
        chargePointId: data.chargePointId,
        transactionId: data.connectorId,
      })
      .toPromise();
    console.log('STOP', { transaction });
    return transaction;
    // this.sessionList.push({ ...this.session, ...data });
  }

  async paymentReceived(data): Promise<any> {
    const user = await this.addBalance({
      userId: data.userId,
      amount: data.amount,
    });
    return await {
      httpStatus: 200,
      status: user ? 'Accepted' : 'Rejected',
      error: [],
    };
  }

  checkMeterValue() {
    const data = meter;
    this.distributorEvenst(JSON.stringify(data));
  }

  getEnergyInterval(index, data) {
    let spendkWh = 0;
    if (data.EnergyInteval != null) {
      spendkWh = data.EnergyInteval;
    } else if (data.Energy != null) {
      spendkWh = data.Energy - this.sessionList[index].energy;
      this.sessionList[index].energy = data.Energy;
    }
  }

  calcSpending(kwh, price) {
    // this.logger.debug(`NEXT Tick amount:$${amount}`);
    return kwh * price;
  }

  async handleMeterValues(payload) {
    const data = meterValueParser(payload);
    console.log('=====handleMeterValues=====', data);
    this.sessionHistoryService.saveMetric({
      transactionId: payload.params.transactionId,
      data,
    });
    const index = this.findSessionIndex({
      chargePointId: payload.chargeBoxId,
      transactionId: payload.params.transactionId,
    });
    if (index >= 0) {
      const spendkWh = this.getEnergyInterval(index, data);
      const spendMoney = this.calcSpending(spendkWh, 0.27);
      const user = this.takeBalance({
        userId: this.sessionList[index].userId,
        amount: spendMoney,
      });
    }
  }

  async handleStartTransaction(data): Promise<any> {
    console.log('|||||StartTransaction||||', data);

    const transaction = await this.sessionHistoryService.sessionStart({
      ...data,
      userId: parseInt(data.params.idTag),
    });

    // if (index >= 0) this.sessionList.splice(index, 1);
  }

  async handleStopTransaction(data): Promise<any> {
    console.log('|||||StopTransaction||||', data);
    // const index = this.findSessionIndex({
    //   chargePointId: data.chargeBoxId,
    //   transactionId: data.transactionId,
    // });
    const session = await this.sessionHistoryService.sessionStop(data);

    // if (index >= 0) this.sessionList.splice(index, 1);
  }

  handleStatusNotification(data) {
    console.log('~~~~handleStatusNotification~~~~', data);
  }

  distributorEvenst(jsondata) {
    const data = JSON.parse(jsondata) ?? jsondata;
    // console.log('DATASSSSSSSS', data);
    switch (data.method) {
      case 'MeterValues':
        this.handleMeterValues(data);
        break;
      // case 'disconnect':
      //   this.stationDisconnect(data);
      //   break;
      case 'StartTransaction':
        this.handleStartTransaction(data);
        break;
      case 'StopTransaction':
        this.handleStopTransaction(data);
        break;
      case 'StatusNotification':
        this.handleStatusNotification(data);
        break;

      default:
        break;
    }
  }
}

// @Cron('*/2 * * * * *')
// handleCron() {
//   this.chargeList.forEach((element, index) => {
//     const data = {
//       transactionId: 1, //element.transactionId,
//       power_usage: element.amount,
//       power_spend: element.amount,
//       battery: element.amount,
//     };

//     // this.sessionHistoryService.saveMetric(data);
//     this.publishEventToApi(data);

//     if (this.chargeList[index].amount <= 0) this.stopCharge(1, index);
//     else
//       this.chargeList[index].amount = this.calcSpending(
//         this.chargeList[index].amount,
//         6,
//         0.004,
//         70,
//       );
//   });
// }

// async startCharge(data): Promise<string> {
//   console.log('Hello EnergyMeterService !', data);

//   if (this.findPaymentIndex(data.chargeBoxId, data.params.connectorId) > 0) {
//   }

//   this.publishEvent({
//     active: 'START_TRANSACTION',
//     chargePointId: data.chargePointId,
//     connectorId: data.connectorId,
//   });

//   const transactionId = this.sessionHistoryService.sessionStart(data);

//   this.chargeList.push({ ...data, transactionId });

//   return 'Hello EnergyMeterService !';
// }

// async stopCharge(id, index): Promise<void> {
//   console.log('Stop Transaction ID:', id);
//   this.chargeList.splice(index, 1);
//   this.publishEvent({
//     active: 'STOP_TRANSACTION',
//     transactionId: id,
//   });

//   const transactionId = this.sessionHistoryService.sessionStop(id);
// }
