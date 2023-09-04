
export const REDIS_REGISTRATION_KEY = (email: string) =>
  `registration:${email}`;

export const REDIS_PASSWORD_RECOVERY_KEY = (email: string) =>
  `password-recovery:${email}`;

export const REDIS_TOKEN_KEY = ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId: number;
}) => `tokens:users:${userId}:${sessionId}`;

export const REDIS_CRYPTO_CURRENCY = ({
  token,
  currency,
}: {
  token: string;
  currency: string;
}) => `cryptocurrency:${token}:price:${currency}`;

export const REDIS_CHAT_ROOM = (room: string) => `room:${room}`;
export const REDIS_ACTIVE_USER = (room: string) => `active_user:${room}`;

