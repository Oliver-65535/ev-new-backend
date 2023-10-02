import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionHistoryEntity } from './session-history.entity';
import { InfluxDbService } from '../influx-db/influx-db.service';

@Injectable()
export class SessionHistoryService {
  constructor(
    @InjectRepository(SessionHistoryEntity)
    private readonly sessionHistoryEntity: Repository<SessionHistoryEntity>,
    private readonly influxDbService: InfluxDbService,
  ) {}

  async sessionStart(data: any): Promise<any> {
    console.log(
      '++++++++++++++++++++++++++++++++++^^^^^^^^^^^^^^^^^^^^^^^^sessionStart(data: any)',
      data,
    );
    const session = new SessionHistoryEntity();

    session.chargePointHardwareId = data.chargeBoxId;
    session.connectorId = data.params.connectorId;
    session.transactionId = data.params.transactionId;
    session.meterStart = data.params.meterStart;
    session.session_start = new Date();
    session.userId = data.userId;
    const res = await this.sessionHistoryEntity.save(session);
    console.log('sessionStart(data: any)', res);
    return res;
  }

  async sessionStop(data): Promise<any> {
    const session = await this.sessionHistoryEntity.findOneBy({
      chargePointHardwareId: data.chargeBoxId,
      connectorId: data.connectorId,
    });
    console.log('sessionStop(data: any)', { data, session });
    // session.meterStop = data.params.meterStop;
    session.session_end = new Date();
    session.meterStop = data.params.meterStop;
    return await this.sessionHistoryEntity.save(session);
  }

  async saveMetric({ transactionId, data }): Promise<any> {
    return await this.influxDbService.saveSessionMetric({
      transactionId,
      data,
    });
  }
}
