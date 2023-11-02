import config from 'config';
import { IEmailConfirmationConf } from './interfaces';

export const emailConfirmConf: IEmailConfirmationConf = config.get<IEmailConfirmationConf>('emailConfirmation');
