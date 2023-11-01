import * as messageBird from 'messagebird';

import { Inject, Injectable } from '@nestjs/common';

import { MessageBird } from 'messagebird/types';
import { initClient } from 'messagebird';
import { smsConf } from '@app/configuration/sms.config';

@Injectable()
export class MessageBirdService {
  messagebird: MessageBird;
  constructor() {
    this.messagebird = initClient(smsConf.apiKey);
  }

  async getBalance() {
    const balance = await this.messagebird.balance.read(function (err, data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
      return data;
    });
    return balance;
  }

  async sendMessage(payload: { recipient: string; message: string }) {
    const params = {
      originator: smsConf.originator,
      recipients: [payload.recipient],
      body: payload.message,
    };

    this.messagebird.messages.create(params, function (err, response) {
      if (err) {
        console.error('ERROR:', err);
        return;
      }
      console.log('RESPONSE', response);
    });
  }
}
