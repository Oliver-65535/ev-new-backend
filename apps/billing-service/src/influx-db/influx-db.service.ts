import * as Influx from 'influx';

import { Injectable } from '@nestjs/common';
import { sessionMeter } from './schemas/session-meter.shema';

const client = new Influx.InfluxDB({
  database: 'influx',
  host: '34.94.253.188',
  port: 8086,
  username: 'admin',
  password: 'admin',
  schema: [sessionMeter],
});

@Injectable()
export class InfluxDbService {
  constructor() {
    // private readonly energyMeterService: EnergyMeterService
    // this.getSessionMetric().then(console.log);
    // this.saveSessionMetric({}).then(console.log);
  }

  async saveSessionMetric({ transactionId, data }): Promise<any> {
    const {
      SoC,
      Power,
      Voltage,
      Amperage,
      Temperature,
      Energy,
      EnergyInteval,
    } = data;
    // const transactionId = '234234';

    return await client.writeMeasurement('sessionMeter', [
      {
        tags: { transactionId: transactionId.toString() },
        fields: {
          SoC,
          Power,
          Voltage,
          Amperage,
          Temperature,
          Energy,
          EnergyInteval,
        },
      },
    ]);
  }

  async getSessionMetric(transactionId = '234234'): Promise<any> {
    return client.query(
      `SELECT "power_usage","power_spend","battery" FROM "sessionMeter" WHERE "transactionId"=$transactionId`,
      {
        placeholders: {
          transactionId: transactionId,
        },
      },
    );
  }
}
