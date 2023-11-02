import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import {
  REDIS_TOKEN_KEY,
  REDIS_REGISTRATION_KEY,
  REDIS_PASSWORD_RECOVERY_KEY,
  REDIS_FILE_STATUS_KEY,
} from './constants/redis-key.constant';
import { SessionExpirationTime } from '@app/configuration';
import {
  IDeleteToken,
  IGetToken,
  ISetToken,
  IGetRegistrationInput,
  ISetRegistrationInput,
  IGetResetPasswordInput,
  ISetResetPasswordInput,
  ISetFileStatusInput,
  IGetFileStatusInput,
} from './interfaces';
import {
  GetTokenModel,
  GetRegistrationDataModel,
  GetResetPasswordDataModel,
} from './models';

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

  // public async setFileStatusData(data: ISetFileStatusInput): Promise<void> {
  //   return await this.setRedisData(REDIS_FILE_STATUS_KEY(data.ownerId), data);
  // }

  // public async getFileStatusData(
  //   data: IGetFileStatusInput,
  // ): Promise<ISetFileStatusInput | []> {
  //   const res: ISetFileStatusInput = await this.getRedisData(
  //     REDIS_FILE_STATUS_KEY(data.ownerId),
  //   );
  //   return res;
  // }

  // public async setRegistrationData(data: ISetRegistrationInput): Promise<void> {
  //   return await this.setRedisData(REDIS_REGISTRATION_KEY(data.email), data);
  // }

  // public async getRegistrationData(
  //   data: IGetRegistrationInput,
  // ): Promise<ISetRegistrationInput | undefined> {
  //   const res: ISetRegistrationInput = await this.getRedisData(
  //     REDIS_REGISTRATION_KEY(data.email),
  //   );
  //   return new GetRegistrationDataModel(res);
  // }

  // public async delRegistrationData(data: IGetRegistrationInput): Promise<void> {
  //   return await this.delRedisData(REDIS_REGISTRATION_KEY(data.email));
  // }

  // public async setResetPasswordData(
  //   data: ISetResetPasswordInput,
  // ): Promise<void> {
  //   return await this.setRedisData(
  //     REDIS_PASSWORD_RECOVERY_KEY(data.email),
  //     data,
  //   );
  // }

  // public async getResetPasswordData(
  //   data: IGetResetPasswordInput,
  // ): Promise<ISetResetPasswordInput | undefined> {
  //   const res: ISetResetPasswordInput = await this.getRedisData(
  //     REDIS_PASSWORD_RECOVERY_KEY(data.email),
  //   );
  //   return new GetResetPasswordDataModel(res);
  // }

  // public async delResetPasswordData(
  //   data: IGetResetPasswordInput,
  // ): Promise<void> {
  //   return await this.delRedisData(REDIS_PASSWORD_RECOVERY_KEY(data.email));
  // }

  public async setRedisData(key: string, data: any): Promise<'OK'> {
    try {
      return await this.redisService.set(
        key,
        JSON.stringify(data),
        'EX',
        SessionExpirationTime,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Method setData exited with error ${error}`,
      );
    }
  }

  public async getRedisData(key: string): Promise<any | undefined> {
    try {
      const jsonData = await this.redisService.get(key);

      if (!jsonData) {
        return undefined;
      }
      const data = JSON.parse(jsonData);

      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Method getData exited with error ${error}`,
      );
    }
  }

  public async delRedisData(key: string): Promise<number> {
    try {
      return await await this.redisService.del(key);
    } catch (error) {
      throw new InternalServerErrorException(
        `Method delData exited with error ${error}`,
      );
    }
  }
}
