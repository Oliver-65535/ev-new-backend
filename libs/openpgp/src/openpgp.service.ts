import * as fs from 'fs';
import * as path from 'path';

import {
  EncryptFilePathInterface,
  FilePathInterface,
} from './openpgp.interface';

import { Injectable } from '@nestjs/common';
import { OpenPGPCoreService } from './utils/openpgp-core.service';
import { pgpconf } from '@app/configuration';

@Injectable()
export class OpenPGPService {
  constructor(private readonly openPGPCoreService: OpenPGPCoreService) {}

  getServerPublicKey(): string {
    return this.openPGPCoreService.getServerPublicKey();
  }

  async encryptFile(input: EncryptFilePathInterface): Promise<string> {
    const dir = path.dirname(input.filePath);
    const decryptedFileName = path.basename(input.filePath);

    const decryptedFilePath = path.join(dir, decryptedFileName);
    const encryptedFilePath = path.join(
      dir,
      `${decryptedFileName}${pgpconf.encryptedExtName}`,
    );

    const encInput = {
      publicKeys: input.publicKeys,
      encryptedFilePath,
      decryptedFilePath,
    };

    return await this.openPGPCoreService.encryptFileStream(encInput);
  }

  async decryptFile(file: FilePathInterface): Promise<string> {
    const dir = path.dirname(file.filePath);
    const encryptedFileName = path.basename(file.filePath);
    const decryptedFileName = path.basename(
      file.filePath,
      pgpconf.encryptedExtName,
    );

    const encryptedFilePath = path.join(dir, encryptedFileName);
    const decryptedFilePath = path.join(dir, decryptedFileName);

    return await this.openPGPCoreService.decryptFileSream({
      encryptedFilePath,
      decryptedFilePath,
    });
  }

  async reencryptFile(input: EncryptFilePathInterface): Promise<string> {
    const decryptedFilePath = await this.decryptFile(input);
    const encryptedFilePath = await this.encryptFile(input);
    fs.rm(decryptedFilePath, err => {
      console.log(err);
    });
    return encryptedFilePath;
  }
}
