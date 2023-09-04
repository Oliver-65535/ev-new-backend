export interface VaultPathInterface {
  readonly path: string;
}

export interface WriteDataVaultInterface extends VaultPathInterface {
  readonly data: object;
}

export interface UpdateDataVaultInterface extends WriteDataVaultInterface {
  readonly version: number;
}
