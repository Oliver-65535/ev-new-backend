import { ArgsType } from '@nestjs/graphql';
import { ChargingHistoryDTO } from './dto/charging-history.dto';
import { QueryArgsType } from '@nestjs-query/query-graphql';

@ArgsType()
export class ChargingHistoryQuery extends QueryArgsType(ChargingHistoryDTO) {}

export const ChargingHistoryConnection = ChargingHistoryQuery.ConnectionType;
