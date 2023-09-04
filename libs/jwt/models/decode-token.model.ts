import { PayloadTokenModel } from './payload-token.model';

export class DecodeTokenModel extends PayloadTokenModel {
  public constructor(partial: Partial<DecodeTokenModel & PayloadTokenModel>) {
    super(partial);

    this.iat = partial.iat;
    this.exp = partial.exp;
  }
  iat: number;
  exp: number;
}
