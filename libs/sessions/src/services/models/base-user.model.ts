import { ApiProperty } from '@nestjs/swagger';

export class BaseUserModel {
  public constructor(partial: Partial<BaseUserModel>) {
    this.id = partial.id;
    this.email = partial.email;
    this.username = partial.username;
    this.birthday = partial.birthday;
    this.isTwoFactorAuthenticationEnabled =
      partial.isTwoFactorAuthenticationEnabled;

    this.createdAt = partial.createdAt;
  }

  @ApiProperty()
  public id: number;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public username?: string;

  @ApiProperty()
  public birthday?: Date;

  @ApiProperty()
  public isTwoFactorAuthenticationEnabled: boolean;

  @ApiProperty()
  public createdAt: Date;
}
