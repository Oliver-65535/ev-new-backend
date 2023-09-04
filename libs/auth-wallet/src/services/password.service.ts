import { compare, hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private saltRounds = 10;

  async getHash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async compareHash(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}
