import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionHistoryEntity } from '@app/entities';

@QueryService(SessionHistoryEntity)
export class SecretService extends TypeOrmQueryService<SessionHistoryEntity> {
  constructor(
    @InjectRepository(SessionHistoryEntity, 'billing')
    repository: Repository<SessionHistoryEntity>,
  ) {
    super(repository);
  }
}
