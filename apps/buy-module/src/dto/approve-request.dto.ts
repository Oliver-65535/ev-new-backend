import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class ApproveRequest {
  @ApiProperty()
  @IsNumber()
  articleId: number;

  @ApiProperty()
  @IsBoolean()
  isApprove: boolean;
}
