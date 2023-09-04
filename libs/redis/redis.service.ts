import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import {
  REDIS_TOKEN_KEY,
} from './constants/redis-key.constant';
import { SessionExpirationTime } from '@app/configuration';
import {
  IDeleteToken,
  IGetToken,
  ISetToken,
} from './interfaces';
import { GetTokenModel } from './models';


@Injectable()
export class RedisService {
  public constructor(
    @InjectRedis()
    private readonly redisService: Redis,
  ) {}

  public async setTokens(data: ISetToken): Promise<void> {
    try {
      const { sessionId, userId, refreshToken, accessToken } = data;

      await this.redisService.set(
        REDIS_TOKEN_KEY({
          sessionId,
          userId,
        }),
        JSON.stringify({
          accessToken,
          refreshToken,
        }),
        'EX',
        SessionExpirationTime,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Method setToken exited with error ${error}`,
      );
    }
  }

  public async getTokens(data: IGetToken): Promise<GetTokenModel | undefined> {
    try {
      const { sessionId, userId } = data;
      const tokens = await this.redisService.get(
        REDIS_TOKEN_KEY({
          sessionId: sessionId,
          userId: userId,
        }),
      );

      if (!tokens) {
        return undefined;
      }

      const parsTokens = JSON.parse(tokens);

      const result = new GetTokenModel(parsTokens);

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Method getToken exited with error ${error}`,
      );
    }
  }

  public async deleteTokens(data: IDeleteToken): Promise<void> {
    try {
      const { sessionId, userId } = data;
      await this.redisService.del(
        REDIS_TOKEN_KEY({
          sessionId: sessionId,
          userId: userId,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Method delToken exited with error ${error}`,
      );
    }
  }
}
