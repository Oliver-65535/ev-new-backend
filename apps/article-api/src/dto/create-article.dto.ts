import { UserEntity } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { GraphArray } from './change-graph.dto';

export class CCreateArticleRequest {
  @ApiProperty()
  @IsOptional()
  articleUrl?: string;

  @ApiProperty({ type: [GraphArray] })
  @IsOptional()
  graph?: GraphArray[];

  @ApiProperty()
  @IsOptional()
  additionalData?: any;
}


export class CCreateArticleRecord extends CCreateArticleRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  ownerId: number;
}
