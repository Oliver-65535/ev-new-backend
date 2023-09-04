import { ArgsType } from '@nestjs/graphql';
import { QueryArgsType } from '@nestjs-query/query-graphql';
import { UserDTO } from './dto/user.dto';

@ArgsType()
export class UserQuery extends QueryArgsType(UserDTO) {}

export const UserConnection = UserQuery.ConnectionType;
