export class GetRegistrationDataModel {
  public constructor(partial: Partial<GetRegistrationDataModel>) {
    this.email = partial.email;
    this.username = partial.username;
    this.password = partial.password;
    this.verificationCode = partial.verificationCode;
    // this.birthday = partial.birthday;
    // this.code = partial.code;
    // this.referralCode = partial.referralCode;
  }

  public email: string;
  public username: string;
  public password: string;
  public verificationCode: string;
  // public birthday: Date;
  // public code: string;
  // public referralCode?: string;
}