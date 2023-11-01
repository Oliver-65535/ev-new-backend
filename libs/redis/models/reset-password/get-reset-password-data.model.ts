export class GetResetPasswordDataModel {
  public constructor(partial: Partial<GetResetPasswordDataModel>) {
    this.email = partial.email;
    this.verificationCode = partial.verificationCode;
  }
  public email: string;
  public verificationCode: string;
}