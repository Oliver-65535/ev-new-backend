import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class UsernameAndPass {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class RegistrationDto extends UsernameAndPass {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  publicKey: string;
}
export class LoginDto extends UsernameAndPass {}
