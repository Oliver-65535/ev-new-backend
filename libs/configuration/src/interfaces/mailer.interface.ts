export interface MailerConfigInterface {
  readonly pool: boolean;
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly user: string;
  readonly pass: string;
}
