import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { ChargingHistoryDTO } from './charging-history.dto';

@InputType('Paging')
export class PagingDTO {
  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  offset: number;
}

@InputType('ChargingHistoryInput')
export class ChargingHistoryInputDTO {
  @Field((type) => PagingDTO, { nullable: true })
  paging: PagingDTO;
}

@InputType('ChargerChargingHistoryInput')
export class ChargerChargingHistoryInputDTO {
  @Field()
  chargePointHardwareId: string;

  @Field((type) => PagingDTO, { nullable: true })
  paging: PagingDTO;
}

@ObjectType('ChargingHistoryResponse')
export class ChargingHistoryResponseDTO {
  @Field()
  count: number;

  @Field((type) => [ChargingHistoryDTO])
  data: ChargingHistoryDTO[];
}
