import { Controller, Get, Param } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

import { OcppPythonServerService } from './ocpp-cs-python.service';

// import { OCPPService } from './ocpp-cs.service';

@Controller('ocpp')
export class OCPPController {
  constructor(
    private readonly ocppPythonServerService: OcppPythonServerService,
  ) {}
  @EventPattern('python-ocpp-cs-channel')
  handleRedisSubscribeOcppCSPython(data: any) {
    console.log(data);
    return this.ocppPythonServerService.handleOcppRedisSubEvent(data);
  }

  @EventPattern('billing-api-channel')
  handleBillingChannel(data: any) {
    console.log(data);
    // this.subscribeService.newEventChargeProgress(data);
  }

  @Get('test')
  test() {
    return this.ocppPythonServerService.runMethodCall({
      chargePointId: 'CP02',
      methodCall: 'RemoteStartTransaction',
      params: { connectorId: 1, idTag: 'aaa' },
    });
  }
}

// test() {
//   return this.ocppPythonServerService.runMethodCall({
//     chargePointId: 'CP02',
//     methodCall: 'RemoteStartTransaction',
//     params: { connectorId: 1, idTag: 'aaa' },
//   });
// }
