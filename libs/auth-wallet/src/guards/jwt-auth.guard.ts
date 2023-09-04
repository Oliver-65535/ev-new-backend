import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity, UserEntity } from '@app/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@app/configuration';
import { ITokenPayload } from '../interfaces/auth-token.payload.interface';
import { Cache } from 'cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { REDIS_TOKEN_KEY } from '@app/configuration';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
    @InjectRedis()
    private redisService: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Unauthorized user',
        });
      }

      const payload = await this.jwtService.verifyAsync<ITokenPayload>(token, {
        secret: jwtConfig.access.secret,
      });

      const user = await this.userRepository.findOneBy({
        address: payload.address,
      });

      if (!user) throw new UnauthorizedException('User not found');

      // const tokenExists = await this.cacheManager.get('access_' + user.address);
      let tokenExists = await this.redisService.get(
        REDIS_TOKEN_KEY(user.address),
      );

      if (!tokenExists)
        throw new UnauthorizedException('AccessToken not found');


      req.user = user;

      return !!user;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
