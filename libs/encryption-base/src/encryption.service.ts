import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import * as bcrypt from 'bcryptjs';
import { SALT } from './encryption.constants';

const asyncScrypt = promisify(scrypt);
const asyncRandomBytes = promisify(randomBytes);

export class EncryptionService {
  private static async getCipher(publicKey: string) {
    const iv = randomBytes(16);
    const key = (await asyncScrypt(publicKey, 'salt', 32)) as Buffer;
    return { iv, key };
  }

  static async encryptPrivateKey(
    publicKey: string,
    privateKey: string,
  ): Promise<string> {
    const { iv, key } = await this.getCipher(publicKey);
    const algorithm = 'aes-256-cbc';

    const cipher = createCipheriv(algorithm, key, iv);
    const encryptedText = Buffer.concat([
      cipher.update(privateKey),
      cipher.final(),
    ]);
    return iv.toString('hex') + ':' + encryptedText.toString('hex');
  }

  static async decryptPrivateKey(
    publicKey: string,
    privateKey: string,
  ): Promise<string> {
    const { key } = await this.getCipher(publicKey);
    const algorithm = 'aes-256-cbc';

    const textParts = privateKey.split(':');
    const ivParse = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(algorithm, key, ivParse);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  static async comparePasswords(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, hashedPassword);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT);
  }

  static async getRandomHexString(size: number): Promise<string> {
    return (await asyncRandomBytes(size)).toString('hex');
  }
}
