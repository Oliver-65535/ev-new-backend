export interface OpenPGPConfigInterface {
  readonly encryptedExtName: string;
  readonly keysPathConfig: string;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly passphrase: string; 
}
