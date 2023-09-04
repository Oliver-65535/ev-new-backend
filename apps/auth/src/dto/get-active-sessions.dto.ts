import { ApiProperty } from '@nestjs/swagger';
import { BasePagination } from '@app/common';
import { SessionTypeEnum } from '../enums';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetActiveSessionsDto extends BasePagination {

  @IsEnum(SessionTypeEnum)
  @ApiProperty({
    enum: SessionTypeEnum,
    enumName: 'SessionTypeEnum',
    required: true,
  })
  public filter: SessionTypeEnum;
}
