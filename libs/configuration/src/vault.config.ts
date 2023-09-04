import { VaultConfigInterface } from './interfaces';
import config from 'config';

export const vaultConf: VaultConfigInterface =
  config.get<VaultConfigInterface>('vault');
