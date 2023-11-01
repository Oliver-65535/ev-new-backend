import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// @InputType()
// export class LoginInputDTO {
//   @Field()
//   @IsString()
//   username!: string;

//   @Field()
//   @IsString()
//   password!: string;
// }

@InputType()
export class SendCodeLoginInputDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}

@InputType()
export class LoginInputDTO extends SendCodeLoginInputDTO {
  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  code!: string;
}

// @InputType()
// export class SendCodeB2CLoginInputDTO {
//   @Field()
//   @IsEmail()
//   email!: string;
// }

// @InputType()
// export class LoginInputB2CDTO extends SendCodeB2CLoginInputDTO {
//   @Field()
//   @IsString()
//   @MinLength(6)
//   @MaxLength(12)
//   code!: string;
// }
