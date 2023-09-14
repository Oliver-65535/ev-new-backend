import { Module } from '@nestjs/common';
import { BaseRepositoryModule } from '../base';
import { ConnectorRepositoryService} from './connector.service';

@Module({
  imports: [BaseRepositoryModule],
  providers: [ConnectorRepositoryService],
  exports: [ConnectorRepositoryService],
})
export class ConnectorRepositoryModule {}
