import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'User refreshToken' })
  @IsNotEmpty()
  refreshToken: string;
}
