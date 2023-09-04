import * as shell from 'shelljs';

import {
  DecryptInputInterface,
  EncryptInputInterface,
  GpgConfigInterface,
  ImportKeyInputInterface,
  SignFileInputInterface,
  SignKeyInputInterface,
  StdOutputInterface,
  VerifySignFileInputInterface,
} from './gpg.interface';

import { Injectable } from '@nestjs/common';
import config from 'config';
import { join } from 'path';

const gpgconf = config.get<GpgConfigInterface>('gpg');

@Injectable()
export class GpgService {
  private basePath = join(__dirname, '..', '..', gpgconf.baseDir);
  private keysDir = join(this.basePath, gpgconf.keysDir);

  private encDir = dirName =>
    join(this.basePath, dirName, gpgconf.encryptedDir);
  private decDir = dirName =>
    join(this.basePath, dirName, gpgconf.decryptedDir);

  private decFile = (dirName, fileName) => join(this.decDir(dirName), fileName);
  private encFile = (dirName, fileName) => join(this.encDir(dirName), fileName);

  onApplicationBootstrap() {
    if (!shell.test('-d', this.basePath)) shell.mkdir('-p', this.basePath);
  }

  async importKey(key: ImportKeyInputInterface): Promise<StdOutputInterface> {
    const dir = shell.test('-d', this.basePath);
    console.log(this.basePath, dir);

    const keyFilePath = join(this.keysDir, key.keyFileName);

    const { stdout, stderr, code } = await shell.exec(
      `${gpgconf.importUserKeyCommand} ${keyFilePath}`,
      {
        stdio: 'inherit',
      },
    );

    if (code == 0) await shell.rm(keyFilePath);

    return { stdout, stderr, code };
  }

  async exportServerKey(): Promise<StdOutputInterface> {
    const { stdout, stderr, code } = await shell.exec(
      `${gpgconf.exportSrvKeyCommand}`,
      {
        stdio: 'inherit',
      },
    );
    return { stdout, stderr, code };
  }

  async signKeyLocal(key: SignKeyInputInterface): Promise<StdOutputInterface> {
    const { stdout, stderr, code } = await shell.exec(
      `${gpgconf.signKeyCommand} ${key.publicKeyId}`,
      {
        stdio: 'inherit',
      },
    );
    return { stdout, stderr, code };
  }

  async SignFile(file: SignFileInputInterface): Promise<StdOutputInterface> {
    const command = `${gpgconf.signFileCommand} ${this.encFile(
      file.dirName,
      file.fileName,
    )}`;

    const result = await shell.exec(command, {
      stdio: 'inherit',
    });

    return result;
  }

  async VerifySignFile(
    file: VerifySignFileInputInterface,
  ): Promise<StdOutputInterface> {
    const command = `${gpgconf.verifySignFileCommand} ${this.encFile(
      file.dirName,
      file.fileName + '.gpg',
    )}`;

    const result = await shell.exec(command, {
      stdio: 'inherit',
    });

    return result;
  }

  async encryptFile(file: EncryptInputInterface): Promise<StdOutputInterface> {
    let recipients = '';

    this.checkDirOrCreate(file.dirName);

    file.publicKeyIds.forEach(e => {
      recipients += ` -r ${e}`;
    });

    const command = `${gpgconf.encryptCommand} ${this.encFile(
      file.dirName,
      file.fileName,
    )} ${recipients} ${this.decFile(file.dirName, file.fileName)}`;

    const result = await shell.exec(command, {
      stdio: 'inherit',
    });

    return result;
  }

  async decryptFile(file: DecryptInputInterface): Promise<StdOutputInterface> {
    const command = `${gpgconf.decryptCommand} ${this.decFile(
      file.dirName,
      file.fileName,
    )}  ${this.encFile(file.dirName, file.fileName)}`;

    const result = await shell.exec(command, {
      stdio: 'inherit',
    });

    return result;
  }

  async reencryptFile({
    publicKeyIds,
    dirName,
    fileName,
  }): Promise<StdOutputInterface> {
    await shell.rm(this.decFile(dirName, fileName));

    const decryptStatus = await this.decryptFile({ dirName, fileName });

    if (decryptStatus.code != 0) throw new Error('File no decrypted');

    await shell.rm(this.encFile(dirName, fileName));

    const encryptStatus = await this.encryptFile({
      publicKeyIds,
      dirName,
      fileName,
    });
    return encryptStatus;
  }

  private checkDirOrCreate(dirName): void {
    if (!shell.test('-d', join(this.basePath, dirName)))
      shell.mkdir('-p', join(this.basePath, dirName));
    if (!shell.test('-d', this.encDir(dirName)))
      shell.mkdir('-p', this.encDir(dirName));
    if (!shell.test('-d', this.decDir(dirName)))
      shell.mkdir('-p', this.decDir(dirName));
  }
}
