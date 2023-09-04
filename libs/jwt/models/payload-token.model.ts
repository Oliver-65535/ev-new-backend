export class PayloadTokenModel {
  public constructor(partial: Partial<PayloadTokenModel>) {
    this.createdAt = partial.createdAt;
    this.username = partial.username;
    this.sessionId = partial.sessionId;
    this.userId = partial.userId;
    this.userMail = partial.userMail;
  }

  public createdAt: Date;
  public username: string;
  public sessionId: string;
  public userId: number;
  public userMail: string;
}
