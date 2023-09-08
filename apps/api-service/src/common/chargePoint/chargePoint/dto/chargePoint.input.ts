import {
  BeforeCreateMany,
  BeforeCreateOne,
  CreateManyInputType,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';

import { UserContext } from '../../../../auth/auth.interfaces';

@InputType('ChargePointInput')
@BeforeCreateOne(
  (input: CreateOneInputType<ChargePointInputDTO>, context: UserContext) => {
    const { user } = context.req;
    // eslint-disable-next-line no-param-reassign
    return {
      input: { ...input.input, ownerId: user.id },
    };
  },
)
@BeforeCreateMany(
  (input: CreateManyInputType<ChargePointInputDTO>, context: UserContext) => {
    const createdBy = context.req.user.username;
    const ownerId = context.req.user.id;
    // eslint-disable-next-line no-param-reassign
    input.input = input.input.map((c) => ({ ...c, ownerId }));
    return input;
  },
)
export class ChargePointInputDTO {
  @Field({ nullable: true })
  chargePointHardwareId: string;

  @Field({ nullable: true })
  chargePointName: string;

  @Field({ nullable: true })
  instantPower: number;

  @Field({ nullable: true })
  power: number;

  @Field({ nullable: true })
  public: boolean;

  @Field()
  siteId: number;

  ownerId!: number;
}
