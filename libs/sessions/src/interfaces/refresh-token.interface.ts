import { ApiProperty } from '@nestjs/swagger';

export class IRefreshToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  timestamp: number;
}
