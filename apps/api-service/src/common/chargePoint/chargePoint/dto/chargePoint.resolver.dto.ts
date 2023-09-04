import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType('CheckChargerIdExistInput')
export class CheckChargerIdExistInputDto {
  @Field({ nullable: true })
  chargerId: string;
}

@ObjectType('CheckChargerIdExistResponse')
export class CheckChargerIdExistResponseDto {
  @Field({ nullable: true })
  exist?: boolean;
}
