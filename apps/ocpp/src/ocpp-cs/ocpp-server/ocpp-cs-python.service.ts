import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RPCServer, createRPCError } from 'ocpp-rpc';
import { chargepoints, chargepointsTime } from './ocpp/ocpp-task.service';
import { redisConfig } from '@app/configuration';
import { OcppCallService } from './ocpp/ocpp-calls.servise';
import { OcppHandlerService } from './ocpp/ocpp-handlers.service';

require('dotenv').config();
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();



@Injectable()
export class OcppPythonServerService {
  redisClient: ClientProxy;

  constructor(private readonly ocppHandlerService: OcppHandlerService) {
    this.redisClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });
  }

  chargePoints: Record<string, OcppCallService> = {};

  async handleOcppRedisSubEvent(data) {
    // console.log('+++++++++++++++++++++++++++++', data);
    if (data.action == 'response') eventEmitter.emit(data.actionId, data);
    else if (data.action == 'event') {
      if (data.method == 'BootNotification' || data.method == 'Heartbeat') {
        const index = chargepointsTime.findIndex(
          (e) => e.id == data.chargePointId,
        );
        const time = new Date().valueOf();
        if (index >= 0)
          chargepointsTime[index] = {
            ...chargepointsTime[index],
            time,
          };
        else {
          chargepointsTime.push({ id: data.chargePointId, time });
        }

        const indexc = chargepoints.findIndex((e) => e == data.chargePointId);
        if (indexc < 0) chargepoints.push(data.chargePointId);
      }
      this.ocppHandlerService.logSend(
        data.method,
        data.chargePointId,
        data.params,
      );
    }
  }

  async runMethodCall({ chargePointId, methodCall, params }) {
    const actionId = new Date().valueOf().toString();

    const payload = {
      chargePointId,
      action: 'request',
      actionId,
      method: methodCall,
      params,
    };

    console.log('runMethodCall!', { payload });

    this.redisClient.emit('python-ocpp-cs-channel', payload);

    return new Promise((resolve, reject) => {
      eventEmitter.on(actionId, (e) => {
        // console.log('Hello world!', e);
        setTimeout(() => {
          reject();
        }, 10000);
        return resolve(e.params);
      });
    });
  }
}
