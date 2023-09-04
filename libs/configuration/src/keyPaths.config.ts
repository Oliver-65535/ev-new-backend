import config from 'config';
import { IKeyPaths } from './interfaces';

export const keysPathConfig: IKeyPaths = config.get<IKeyPaths>('keysPath');
