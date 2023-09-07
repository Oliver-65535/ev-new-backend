import { Injectable } from '@nestjs/common';
import { updateLog } from './ocpp-task.service';

// import { MethodCall as MC } from 'src/enums/method.enum';

@Injectable()
export class OcppCallService {
  client: any; // replace any with the type of the client if known

  constructor(client: any) {
    this.client = client;
  }

  async call({ methodCall, params }): Promise<any> {
    this.logSended(methodCall, params);

    if (methodCall == 'GetConfiguration') params.key = [params.key];
    const response = await this.client.call(methodCall, params);

    this.logReceived(methodCall, response);
    return response;
  }

  private logSended(method, params) {
    const log = {
      Sended: new Date().toLocaleString(),
      chargeBoxId: this.client.identity,
      method,
      params,
    };

    console.log(JSON.stringify(log, null, 2));
    updateLog(log);
  }

  private logReceived(method, response) {
    const log = {
      Received: new Date().toLocaleString(),
      sessionId: this.client.sessionId,
      chargeBoxId: this.client.identity,
      method,
      response,
    };

    console.log(JSON.stringify(log, null, 2));
    updateLog(log);
  }
}
