export interface IJwt {
  secret: string;
  expires: string;
}

export interface IAccess {
  secret: string;
  expires: number;
}



export interface IJwtConfig {
  nonce: IJwt;
  access: IAccess;
  refresh: IJwt;
  accessTokenExpire: string;
  refreshTokenExpire: string;
}
