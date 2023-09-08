import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargePointEntity } from '../../../../../../libs/entities/src/charger.entity';
import { CheckChargerIdExistResponseDto } from './dto/chargePoint.resolver.dto';

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
