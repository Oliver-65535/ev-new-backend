import config from 'config';

export const SessionExpirationTime = config.get<number>(
  'sessionExpirationTime',
);
