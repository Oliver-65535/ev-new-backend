export class SessionModel {
  public constructor(partial: Partial<SessionModel>) {
    this.accessToken = partial.accessToken;
    this.refreshToken = partial.refreshToken;
    this.timestamp = partial.timestamp;
  }

  public accessToken: string;
  public refreshToken: string;
  public timestamp: number;
}
