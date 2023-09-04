import { ArgsType } from '@nestjs/graphql';
import { OrganizationDTO } from './dto/organization.dto';
import { QueryArgsType } from '@nestjs-query/query-graphql';

@ArgsType()
export class OrganizationQuery extends QueryArgsType(OrganizationDTO) {}

export const OrganizationConnection = OrganizationQuery.ConnectionType;
