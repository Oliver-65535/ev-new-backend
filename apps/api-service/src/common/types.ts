export interface JwtPayload {
  uid?: number;
  phoneNumber?: string;
  email?: string;
  verified: boolean;
}
