export interface EncryptInputInterface extends DecryptInputInterface {
  readonly publicKeyIds: string[];
}

export interface DecryptInputInterface {
  readonly dirName: string;
  readonly fileName: string;
}

export interface ImportKeyInputInterface {
  readonly keyFileName: string;
}

export interface StdOutputInterface {
  readonly stdout: string;
  readonly stderr: string;
  readonly code: number;
}

export interface SignKeyInputInterface {
  readonly publicKeyId: string;
}

export interface SignFileInputInterface extends DecryptInputInterface {}
export interface VerifySignFileInputInterface extends DecryptInputInterface {}

export interface GpgConfigInterface {
  readonly baseDir: string;
  readonly keysDir: string;
  readonly encryptedDir: string;
  readonly decryptedDir: string;
  readonly importUserKeyCommand: string;
  readonly exportSrvKeyCommand: string;
  readonly encryptCommand: string;
  readonly decryptCommand: string;
  readonly signKeyCommand: string;
  readonly signFileCommand: string;
  readonly verifySignFileCommand: string;
}
