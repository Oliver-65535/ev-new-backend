import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EthNonceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}
