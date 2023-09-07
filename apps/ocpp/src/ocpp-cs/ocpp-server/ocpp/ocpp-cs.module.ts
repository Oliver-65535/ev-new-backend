import { Module } from '@nestjs/common';
import { OcppServerModule } from '../ocpp-cs.module';
import { OcppHandlerService } from './ocpp-handlers.service';
import { OcppTaskService } from './ocpp-task.service';

@Module({
  imports: [OcppServerModule],
  providers: [OcppTaskService],
  exports: [OcppTaskService],
})
export class OcppServicesModule {}
