export class GetTokenModel {
  public constructor(partial: Partial<GetTokenModel>) {
    this.accessToken = partial.accessToken;
    this.refreshToken = partial.refreshToken;
  }

  public accessToken: string;
  public refreshToken: string;
}
