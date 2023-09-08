import {
  BeforeCreateMany,
  BeforeCreateOne,
  CreateManyInputType,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';
import { Field, InputType } from '@nestjs/graphql';

import { UserContext } from '../../../../../auth/auth.interfaces';

@InputType('ConnectorInput')
@BeforeCreateOne(
  (input: CreateOneInputType<ConnectorInputDTO>, context: UserContext) => {
    const { user } = context.req;
    // eslint-disable-next-line no-param-reassign
    return {
      input: { ...input.input, ownerId: user.id },
    };
  },
)
@BeforeCreateMany(
  (input: CreateManyInputType<ConnectorInputDTO>, context: UserContext) => {
    const createdBy = context.req.user.username;
    const ownerId = context.req.user.id;
    // eslint-disable-next-line no-param-reassign
    input.input = input.input.map((c) => ({ ...c, ownerId }));
    return input;
  },
)
export class ConnectorInputDTO {
  @Field({ nullable: true })
  label: string;

  @Field({ nullable: true })
  chargePointHardwareId!: string;

  @Field({ nullable: true })
  connectorTypeName: string;

  @Field({ nullable: true })
  connectorTypeId: string;

  @Field({ nullable: true })
  information: string;

  @Field({ nullable: true })
  instantPower: number;

  @Field({ nullable: true })
  power: number;

  @Field({ nullable: true })
  maxPower: number;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  priceUnit: string;

  @Field()
  chargePointId: number;

  @Field()
  siteId: number;

  ownerId!: number;
}
