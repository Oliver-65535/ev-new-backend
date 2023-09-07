import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

import { OcppTaskService } from '../ocpp-cs/ocpp-server/ocpp/ocpp-task.service';

@Controller('dashboard')
export class DasboardController {
  constructor(private readonly ocppTaskService: OcppTaskService) {}
  @Get('/get-data')
  getData(): Promise<any> {
    return this.ocppTaskService.getData();
  }
  @Get('/get-logs')
  getLogs(): Promise<any> {
    return this.ocppTaskService.getLogs();
  }
  @Get('/clear-logs')
  clearLogs(): Promise<any> {
    return this.ocppTaskService.clearLogs();
  }
  @Post('/call-method')
  callMethod(@Body() body: any): Promise<any> {
    console.log('QUERY', body);
    const { chargePointId, methodCall, params } = body;
    return this.ocppTaskService.runTaskCall({
      chargePointId,
      methodCall,
      params,
    });
  }
}
