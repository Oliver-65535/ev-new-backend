import config from 'config';
import { IRedisConfig } from './interfaces';

export const redisConfig: IRedisConfig = config.get<IRedisConfig>('redis');

export const REDIS_TOKEN_KEY = (address: string) => `tokens:users:${address}`;