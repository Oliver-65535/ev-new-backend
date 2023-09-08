import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';

@Injectable()
export class JwtService {
  private publicKey: string;

  constructor() {
    try {
      this.publicKey = readFileSync('./public_key.pem', 'utf8');
    } catch (error) {
      console.error(`Error reading JWT keys: ${error}`);
    }
  }

  verify(token: string): any {
    if (!this.publicKey) {
      throw new Error('Public key not provided');
    }
    return verify(token, this.publicKey, { algorithms: ['RS256'] });
  }
}
