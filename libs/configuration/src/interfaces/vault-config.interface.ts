export interface VaultConfigInterface {
  readonly token: string;
  readonly https: boolean;
  readonly baseUrl: string;
  readonly rootPath: string;
  readonly path: string;
  readonly timeout: number;
  readonly proxy: boolean;
}
