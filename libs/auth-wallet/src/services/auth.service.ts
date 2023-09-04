import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EthLogInDto } from '../dto/eth-log-in.dto';
import {
  NonceTokenEntity,
  RefreshTokenEntity,
  UserEntity,
} from '@app/entities';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { jwtConfig } from '@app/configuration';
import { EthNonceDto } from '../dto/eth-nonce.dto';
import { INonceTokenPayload } from '../interfaces/nonce-token.payload.interface';

import * as ethers from 'ethers';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { REDIS_TOKEN_KEY } from '@app/configuration';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    @InjectRepository(NonceTokenEntity)
    private nonceTokenRepository: Repository<NonceTokenEntity>,
    private readonly jwtService: JwtService,
    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
    @InjectRedis()
    private readonly redisService: Redis,
  ) {}

  async ethNonce(dto: EthNonceDto) {
    console.log({dto})

    const address = dto.address.toLowerCase()

    const token = await this.jwtService.signAsync(
      {address},
      {
        secret: jwtConfig.nonce.secret,
        expiresIn: jwtConfig.nonce.expires,
      },
    );

    await this.nonceTokenRepository.delete({ address });

    const n = await this.nonceTokenRepository.save({ address, token });

    console.log({n})

    return { token };
  }

  async fall() {
    await this.redisService.flushall()
  }

  async ethLogin(dto: EthLogInDto) {
    try {
      const { address } = await this.jwtService.verifyAsync<INonceTokenPayload>(
        dto.token,
        {
          secret: jwtConfig.nonce.secret,
        },
      );

      const nonceTokenExists = await this.nonceTokenRepository.findOneBy({
        token: dto.token,
        address: address,
      });

      if (!nonceTokenExists)
        throw new UnauthorizedException('Nonce token not found');

      const signerAddress = ethers.verifyMessage(
        dto.token,
        dto.signature,
      );

      if (address !== signerAddress)
        throw new UnauthorizedException('Addresses does not match');

      await this.nonceTokenRepository.delete({ address, token: dto.token });

      let user = await this.userRepository.findOneBy({ address });

      if (!user) {
        user = await this.userRepository.save({
          address: address,
          name: Date.now().toString(),
        });
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
    }
  }

  async logout(user: UserEntity) {
    await this.redisService.del(REDIS_TOKEN_KEY(user.address));
    // await this.refreshTokenRepository.delete({ user });
  }

  async refresh(token: string) {
    const { address } = await this.jwtService.verifyAsync(token, {
      secret: jwtConfig.refresh.secret,
    });

    const user = await this.userRepository.findOneBy({ address });

    if (!user) throw new UnauthorizedException();

    const tokenExists = await this.refreshTokenRepository.findOneBy({ token });

    if (!tokenExists) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserEntity) {
    const { refreshToken, accessToken } = {
      refreshToken: await this.generateRefresh(user),
      accessToken: await this.generateAccess(user),
    };
    await this.redisService.set(
      REDIS_TOKEN_KEY(user.address),
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
      'EX',
      //TODO: remove later this magic number
      86400000,
    );

    return { refreshToken, accessToken };
  }

  private async generateAccess(user: UserEntity) {
    const token = await this.jwtService.signAsync(
      {
        address: user.address,
      },
      {
        secret: jwtConfig.access.secret,
        expiresIn: jwtConfig.access.expires,
      },
    );

    // await this.cacheManager.set('access_' + user.address, token);

    return token;
  }

  private async generateRefresh(user: UserEntity) {
    const token = await this.jwtService.signAsync(
      {
        address: user.address,
      },
      {
        secret: jwtConfig.refresh.secret,
        expiresIn: jwtConfig.refresh.expires,
      },
    );

    await this.refreshTokenRepository.delete({ user });

    const refresh = new RefreshTokenEntity();

    refresh.user = user;
    refresh.token = token;

    await this.refreshTokenRepository.save(refresh);

    return token;
  }
}
// function REDIS_TOKEN_KEY(): import("ioredis").RedisKey {
//   throw new Error('Function not implemented.');
// }
