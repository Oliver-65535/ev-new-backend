import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { UserEntity } from '@app/entities';
import { LoginResponseDTO } from './dto/login-response.dto';
import { AuthenticatedUser, JwtPayload } from './auth.interfaces';
import { UserDTO } from '../common/user/user-graphql/dto/user.dto';
import { SendCodeLoginInputDTO } from './dto/login-input.dto';
import { RedisService } from 'libs/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueryService(UserEntity)
    private usersService: QueryService<UserEntity>,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthenticatedUser | null> {
    const [user] = await this.usersService.query({
      filter: { username: { eq: username } },
      paging: { limit: 1 },
    });

    // const user = { id: 1, username: 'user', password: 'pass' };

    // dont use plain text passwords in production!
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendCodeLogin(input: SendCodeLoginInputDTO): Promise<void> {
    if (input.email) {
      console.log('EEEEEEEEEEEEE', input.email);
    } else {
      console.log('PPPPPPPPPPPPP', input.phone);
    }
  }

  async currentUser(authUser: AuthenticatedUser): Promise<UserDTO> {
    try {
      const user = await this.usersService.getById(authUser.id);
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  login(user: AuthenticatedUser): Promise<LoginResponseDTO> {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      accessToken: this.jwtService.sign(payload),
    });
  }
}
