import { DateExpireTokenEnum } from '../enums';

export const expireToken = {
  [DateExpireTokenEnum.HOUR]: 3600,
  [DateExpireTokenEnum.DAY]: 86400,
};
