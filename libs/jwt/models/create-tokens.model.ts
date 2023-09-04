export class CreateTokensModel {
  public constructor(partial: Partial<CreateTokensModel>) {
    this.accessToken = partial.accessToken;
    this.refreshToken = partial.refreshToken;
    this.accessTokenExpire = partial.accessTokenExpire;
  }

  public accessToken: string;
  public refreshToken: string;
  public accessTokenExpire: number;
}
