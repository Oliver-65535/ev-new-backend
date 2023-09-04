import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType('ChargingHistoryUpdate')
export class ChargingHistoryUpdateDTO {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Field({ nullable: true })
  account_id?: string;

  @IsOptional()
  @Field({ nullable: true })
  name?: string;
}
