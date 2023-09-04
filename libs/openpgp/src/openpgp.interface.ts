export interface EncryptInputInterface extends PathInputInterface {
  readonly publicKeys: string[];
}

export interface DecryptedInputInterface extends PathInputInterface {}

export interface PathInputInterface {
  readonly encryptedFilePath: string;
  readonly decryptedFilePath: string;
}

export interface FilePathInterface {
  readonly filePath: string;
}

export interface EncryptFilePathInterface extends FilePathInterface {
  readonly publicKeys: string[];
}

export interface OpenPGPKeysInterface {
  // readonly encryptedExtName: string;
  readonly public_key: string;
  readonly private_key: string;
  readonly passphrase: string;
}
