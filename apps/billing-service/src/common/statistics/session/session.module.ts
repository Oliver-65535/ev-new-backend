// import { EnergyMeterModule } from 'src/energy-meter/energy-meter.module';

import { Module } from '@nestjs/common';
import { SessionMetricService } from './session.service';

@Module({
  // imports: [EnergyMeterModule],
  providers: [SessionMetricService],
  exports: [SessionMetricService],
  // controllers: [SessionMetricController],
})
export class SessionMetricModule {}
