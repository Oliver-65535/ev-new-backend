import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargePointEntity } from './chargePoint.entity';
import { CheckChargerIdExistResponseDto } from './dto/chargePoint.resolver.dto';

import { OCPPService } from 'src/modules-microservices/ocpp-cs-service/ocpp-cs.service';

@Injectable()
export class ChargePointService {
  constructor(
    @InjectRepository(ChargePointEntity)
    private readonly chargePointRepository: Repository<ChargePointEntity>,
  ) {}

  async checkChargerIdExist(
    chargerId: string,
  ): Promise<CheckChargerIdExistResponseDto> {
    const exist = await this.chargePointRepository.exist({
      where: { chargePointHardwareId: chargerId },
    });
    return { exist };
  }
}
