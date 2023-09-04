import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@app/entities';

export class AuthResponse {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  timestamp: number;
}
