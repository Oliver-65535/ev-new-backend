import { IResult, ICPU, IOS, IEngine, IBrowser, IDevice } from 'ua-parser-js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface IUserAgentInfo extends Omit<IResult, 'ua'> {}

export class CPU implements ICPU {
  @ApiPropertyOptional()
  architecture: string;
}

export class OS implements IOS {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  version: string;
}

export class Engine implements IEngine {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  version: string;
}

export class Device implements IDevice {
  @ApiPropertyOptional()
  model: string;

  @ApiPropertyOptional()
  type: string;

  @ApiPropertyOptional()
  vendor: string;
}

export class Browser implements IBrowser {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  version: string;

  @ApiPropertyOptional()
  major: string;
}

export class UserAgentInfoResponseDto implements IUserAgentInfo {
  @ApiProperty()
  browser: Browser;
  @ApiProperty()
  device: Device;
  @ApiProperty()
  engine: Engine;
  @ApiProperty()
  os: OS;
  @ApiProperty()
  cpu: CPU;
}
