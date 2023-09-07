import { Module } from '@nestjs/common';
import { OCPPController } from './ocpp-cs.controller';
import { OcppHandlerService } from './ocpp/ocpp-handlers.service';
import { OcppPythonServerService } from './ocpp-cs-python.service';

// import { OcppServerService } from './ocpp-server.service';

// import { OcppCallService } from './ocpp/ocpp-calls.servise';

// import { OcppServicesModule } from './ocpp/ocpp-cs.module';

@Module({
  imports: [],
  controllers: [OCPPController],
  providers: [OcppHandlerService, OcppPythonServerService],
  exports: [OcppPythonServerService],
})
export class OcppServerModule {}
