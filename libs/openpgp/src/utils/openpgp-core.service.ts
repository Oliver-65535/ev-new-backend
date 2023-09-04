import * as fs from 'node:fs';
import * as openpgp from 'openpgp';

import {
  DecryptedInputInterface,
  EncryptInputInterface,
} from '../openpgp.interface';
import { EEncoding, EFlagsEnum, EPGPFormat } from '../enum';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { VaultService } from 'libs/vault/src/vault.service';
import { keysPathConfig } from '@app/configuration';

@Injectable()
export class OpenPGPCoreService implements OnModuleInit {
  constructor(private readonly vaultService: VaultService) {}

  private serverPrivateKeyArmored = '';
  private serverPublicKeyArmored = '';
  private passphrase = '';

  // private serverPrivateKeyArmored = fs.readFileSync(keysPathConfig.privateKey, {
  //   encoding: EEncoding.utf8,
  //   flag: EFlagsEnum.r,
  // });
  // private serverPublicKeyArmored = fs.readFileSync(keysPathConfig.publicKey, {
  //   encoding: EEncoding.utf8,
  //   flag: EFlagsEnum.r,
  // });
  // private passphrase = fs.readFileSync(keysPathConfig.passphrase, {
  //   encoding: EEncoding.utf8,
  //   flag: EFlagsEnum.r,
  // });

  onModuleInit() {
    fs.readFile(keysPathConfig.keysPath, EEncoding.utf8, (err, data) => {
      if (err) throw err;
      let keys = JSON.parse(data);
      this.serverPrivateKeyArmored = keys.private_key;
      this.serverPublicKeyArmored = keys.public_key;
      this.passphrase = keys.passphrase;
    });
    // this.vaultService.vaultReadData(keysPathConfig.keysPathVault).then(e => {
    //   this.serverPrivateKeyArmored = e.privateKey;
    //   this.serverPublicKeyArmored = e.publicKey;
    //   this.passphrase = e.passphrase;
    // });
  }

  getServerPublicKey(): string {
    return this.serverPublicKeyArmored;
  }

  async encryptFile(input: EncryptInputInterface): Promise<string> {
    const publicKey = await this.loadPublicKeys(input.publicKeys);

    const binaryData = fs.readFileSync(input.decryptedFilePath);
    const message = await openpgp.createMessage({
      binary: binaryData,
    });
    const encrypted = await openpgp.encrypt({
      message,
      encryptionKeys: publicKey,
      format: EPGPFormat.BINARY,
      config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib },
    });

    const encryptedData: any = encrypted;

    fs.writeFileSync(input.encryptedFilePath, encryptedData);

    return input.decryptedFilePath;
  }

  async decryptFile(input: DecryptedInputInterface): Promise<string> {
    const privateKey = await this.loadPrivateKey();

    const binaryData = fs.readFileSync(input.encryptedFilePath);

    const encryptedMessage = await openpgp.readMessage({
      binaryMessage: binaryData, // parse encrypted bytes
    });
    const { data: decrypted } = await openpgp.decrypt({
      message: encryptedMessage,
      decryptionKeys: privateKey,
      format: EPGPFormat.BINARY,
      config: {
        preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
      },
    });
    let decryptedData: any = decrypted;

    fs.writeFileSync(input.decryptedFilePath, decryptedData);

    return input.decryptedFilePath;
  }

  async encryptFileStream(input: EncryptInputInterface): Promise<string> {
    const publicKey = await this.loadPublicKeys(input.publicKeys);

    const binaryData = fs.createReadStream(input.decryptedFilePath);
    const message = await openpgp.createMessage({
      binary: binaryData,
    });
    const encrypted = await openpgp.encrypt({
      message,
      encryptionKeys: publicKey,
      format: EPGPFormat.BINARY,
      config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib },
    });

    const readStream: any = encrypted;
    let writeStream = fs.createWriteStream(input.encryptedFilePath, {
      flags: EFlagsEnum.w,
    });
    readStream.pipe(writeStream);

    new Promise((resolve, reject) => {
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });

    return input.decryptedFilePath;
  }

  async decryptFileSream(input: DecryptedInputInterface): Promise<string> {
    const privateKey = await this.loadPrivateKey();

    const binaryData = fs.createReadStream(input.encryptedFilePath);

    const encryptedMessage = await openpgp.readMessage({
      binaryMessage: binaryData, // parse encrypted bytes
    });
    const { data: decrypted } = await openpgp.decrypt({
      message: encryptedMessage,
      decryptionKeys: privateKey,
      format: EPGPFormat.BINARY,
      config: {
        preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
        allowUnauthenticatedStream: true,
      },
    });
    let readStream: any = decrypted;
    let writeStream = fs.createWriteStream(input.decryptedFilePath, {
      flags: EFlagsEnum.w,
    });
    readStream.pipe(writeStream);

    new Promise((resolve, reject) => {
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });

    return input.decryptedFilePath;
  }

  private async loadPublicKeys(publicArmoredKeys) {
    let armoredKeys = publicArmoredKeys;
    publicArmoredKeys.push(this.serverPublicKeyArmored);

    const loadPublicKeyFnArray = armoredKeys.map(
      async e => await openpgp.readKey({ armoredKey: e }),
    );
    return Promise.all(loadPublicKeyFnArray);
  }

  private async loadPrivateKey() {
    return await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({
        armoredKey: this.serverPrivateKeyArmored,
      }),
      passphrase: this.passphrase,
    });
  }
}
