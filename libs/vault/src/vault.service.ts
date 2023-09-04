import {
  UpdateDataVaultInterface,
  VaultPathInterface,
  WriteDataVaultInterface,
} from './vault.interface';

import { Injectable } from '@nestjs/common';
import { vaultConf } from '@app/configuration';

const Vault = require('hashi-vault-js');

@Injectable()
export class VaultService {
  // vault = new Vault({
  //   https: Boolean(vaultConf.https),
  //   baseUrl: vaultConf.baseUrl,
  //   rootPath: vaultConf.rootPath,
  //   timeout: Number(vaultConf.timeout),
  //   proxy: Boolean(vaultConf.proxy),
  // });

  // async vaultWriteData(input: WriteDataVaultInterface) {
  //   const response = await vault.createKVSecret(token, input.path, input.data);
  //   return response;
  // }

  // async vaultUpdateData(input: UpdateDataVaultInterface) {
  //   const response = await vault.updateKVSecret(
  //     token,
  //     input.path,
  //     input.data,
  //     input.version,
  //   );
  //   return response;
  // }

  // async vaultReadData(path: string) {
  //   try {
  //     const { data } = await vault.readKVSecret(token, path);
  //     return data;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}
