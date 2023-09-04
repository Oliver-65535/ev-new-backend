import { IsString, IsNotEmpty, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoveryPasswordDto {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'wrong password',
    },
  )
  readonly password: string;

  @ApiProperty({ description: 'Verificaton code from email' })
  @IsString()
  @IsNotEmpty()
  readonly code: string;
}
