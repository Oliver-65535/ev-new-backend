import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRequest {
  @ApiProperty()
  @IsNumber()
  article: number;

  @ApiProperty()
  @IsNumber()
  requester: number;

  @ApiProperty()
  @IsNumber()
  ownerId: string;
}
