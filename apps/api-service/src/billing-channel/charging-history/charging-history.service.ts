import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionHistoryEntity } from '../../../../../libs/entities/src/charging-history.entity';

@Injectable()
export class ChargingHistoryService {
  constructor(
    @InjectRepository(SessionHistoryEntity)
    private sessionHistoryRepository: Repository<SessionHistoryEntity>,
  ) {}

  async getChargingHistory(input): Promise<any> {
    const session = await this.sessionHistoryRepository.findAndCount({
      where: { userId: input.userId },
      order: { id: { direction: 'DESC' } },
      take: input.paging.limit,
      skip: input.paging.offset,
    });
    return { data: session[0], count: session[1] };
  }

  async connectorChargingHistory(input): Promise<any> {
    return await this.sessionHistoryRepository.find({
      where: { chargePointHardwareId: input.chargePointHardwareId },
      order: { id: { direction: 'DESC' } },
      take: input.paging.limit,
      skip: input.paging.offset,
    });
  }
}
