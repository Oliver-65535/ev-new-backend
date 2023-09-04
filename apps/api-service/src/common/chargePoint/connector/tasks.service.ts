import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConnectorService } from './connector.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly connectorService: ConnectorService,
  ) { }

  @Cron('* * * * * *')
  async checkBookings() {
    await this.connectorService.moveExpiredBookingsToSoftBookings();
  }

  @Cron('* * * * * *')
  async checkSoftBookings() {
    await this.connectorService.moveExpiredSoftBookingsToAvailable();
  }
}
