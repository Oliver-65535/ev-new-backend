import { Module } from '@nestjs/common';
import { BaseRepositoryModule, ConnectorRepositoryModule } from './index';

@Module({
  imports: [BaseRepositoryModule, ConnectorRepositoryModule],
})
export class RepositoriesLibModule {}
