import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectorEntity } from '@app/entities';
import { BaseAbstractRepository } from '../base';

@Injectable()
export class ConnectorRepositoryService extends BaseAbstractRepository<ConnectorEntity> {
  constructor(
    @InjectRepository(ConnectorEntity)
    private readonly ConnectorEntity: Repository<ConnectorEntity>,
  ) {
    super(ConnectorEntity);
  }
}
