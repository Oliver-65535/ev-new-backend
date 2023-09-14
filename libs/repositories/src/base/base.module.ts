import { Module } from '@nestjs/common';
import { BaseRepositoryService} from './base.service';

@Module({
  imports: [],
  providers: [BaseRepositoryService],
  exports: [BaseRepositoryService],
})
export class BaseRepositoryModule {}
