import {
  Client,
  ClientGrpc,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { chargepoints, transactions } from './ocpp-task.service';
import {
  createTransaction,
  delTransaction,
  findTransaction,
  updateTransaction,
} from './ocpp-transaction.service';

import { getDeadlineTimeoutString } from '@grpc/grpc-js/build/src/deadline';
// import { grpcOcppClientOptions } from 'src/grpc-client-config/ocpp-grpc-client';
import { Method as m } from '@app/common';
import { Status as s } from '@app/common';
import { updateLog } from './ocpp-task.service';

// import { Injectable } from '@nestjs/common';

@Injectable()
export class OcppHandlerService {
  constructor() {}

  logSend(method, chargePointId, params) {
    const data = {
      handleReseived: new Date().toISOString(),
      chargeBoxId: chargePointId,
      method,
      params,
    };

    //console.log(JSON.stringify(data, null, 2));
    updateLog(data);
    logSubject.next({ event: JSON.stringify(data, null, 2) });
  }
}

export const logSubject = new Subject<{ event: string }>();
