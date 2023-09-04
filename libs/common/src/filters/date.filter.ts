import { BasePagination } from './base-pagination.filter';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, MaxDate, MinDate } from 'class-validator';

const date = new Date();
date.setDate(date.getDate() + 1);

const minDate = new Date(0);
const maxDate = date;
export class DateFilter extends BasePagination {
  @MinDate(minDate)
  @MaxDate(maxDate)
  @IsDate()
  @Transform(val => new Date(val.value))
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Date,
    default: minDate,
    example: '1970-01-01',
  })
  public startDate: Date = minDate;

  @MinDate(minDate)
  @MaxDate(maxDate)
  @IsDate()
  @Transform(val => new Date(val.value))
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Date,
    default: maxDate,
    example: '2022-11-11',
  })
  public endDate: Date = maxDate;
}
