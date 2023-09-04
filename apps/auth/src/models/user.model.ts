import { BaseModel } from './base-model.model';

export class UserModel extends BaseModel {
  public constructor(partial: Partial<UserModel & BaseModel>) {
    super(partial);

    this.id = partial.id;
    this.email = partial.email;
    this.username = partial.username;
    this.passwordHash = '';
    this.birthday = partial.birthday;
    this.role = partial.role;
    this.twoFactorAuthenticationSecret = partial.twoFactorAuthenticationSecret;
    this.isTwoFactorAuthenticationEnabled =
      partial.isTwoFactorAuthenticationEnabled;
    this.isHidden = partial.isHidden;
    this.google = partial.google;
    this.twitch = partial.twitch;
    this.facebook = partial.facebook;
    this.line = partial.line;
    this.canChangeUsername = partial.canChangeUsername;
    this.chatRoom = partial.chatRoom;
    this.spentAmount = partial.spentAmount;
    this.isChatAccessible = partial.isChatAccessible;
    this.rank = partial.rank;
  }

  public id: number;
  public email: string;
  public username?: string;
  public passwordHash?: string;
  public birthday?: Date;
  public role: string;
  public twoFactorAuthenticationSecret?: string;
  public isTwoFactorAuthenticationEnabled: boolean;
  public isHidden: boolean;
  public google: string;
  public twitch: string;
  public facebook: string;
  public line: string;
  public canChangeUsername: boolean;
  public chatRoom: string;
  public spentAmount: number;
  public isChatAccessible: string;
  public rank: number;
}
