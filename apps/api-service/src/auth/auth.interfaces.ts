import { UserEntity } from 'src/common/user/user.entity';

export type AuthenticatedUser = Pick<
  UserEntity,
  'id' | 'username' | 'name' | 'email'
>;
export type JwtPayload = {
  sub: number;
  username: string;
  name: string;
  email: string;
};

export type UserContext = {
  req: {
    user: AuthenticatedUser;
  };
};
