import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  data?: T[];
}
