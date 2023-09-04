import config from 'config';
import { IJwtConfig } from './interfaces';

export const jwtConfig: IJwtConfig = config.get<IJwtConfig>('jwt');
