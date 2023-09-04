import { ApiProperty } from '@nestjs/swagger';

export class EthNonceResponseDto {
  @ApiProperty()
  token: string;
}
