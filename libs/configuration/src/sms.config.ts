import { SmsConfigInterface } from './interfaces';
import config from 'config';

export const smsConf: SmsConfigInterface =
  config.get<SmsConfigInterface>('sms-service');
