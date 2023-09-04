import { EncryptionService } from '@app/encryption-base';
import { UserService } from '@app/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { JwtCustomService } from 'libs/jwt/jwt.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService,
    private readonly jwtCustomService: JwtCustomService) {}

  public async register(userBody: any) {
    console.log(userBody)
    const newUser = await this.userService.create(userBody);
    return newUser;
  }

  public async login(username: string, plaintextPassword: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('Wrong credentials provided');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Unable to login via e-mail and password');
    }

    const passwordsMatch = await EncryptionService.comparePasswords(
      plaintextPassword,
      user.passwordHash,
    );
    if (!passwordsMatch)
      throw new BadRequestException('Wrong credentials provided');

    return user;
  }
}
