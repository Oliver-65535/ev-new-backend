import { SortByEnum } from '@app/common/filters/sort-by.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseFilterFilter {
  @IsEnum(SortByEnum)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: SortByEnum,
    enumName: 'SortByEnum',
    default: SortByEnum.DESC,
    description: 'default value is DESC',
    example: SortByEnum.DESC,
  })
  public sortBy: SortByEnum = SortByEnum.DESC;
}
