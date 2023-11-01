import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('LoginResponseDTO')
export class LoginResponseDTO {
  @Field()
  accessToken: string;
}

@ObjectType('SendCodeResponseDTO')
export class SendCodeResponseDTO {
  @Field()
  status: string;
}
