import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingChannelService {
  redisClient: ClientProxy;

  constructor() {
    this.redisClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  async publishEvent(params: any) {
    //this.redisClient.emit('api-billing-channel', params);
    return this.redisClient.emit('api-billing-channel', params);
  }
}
