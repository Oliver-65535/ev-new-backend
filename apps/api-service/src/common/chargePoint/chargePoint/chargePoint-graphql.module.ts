import { ChargePointDTO } from './dto/chargePoint.dto';
import { ChargePointEntity } from '@app/entities';
import { ChargePointInputDTO } from './dto/chargePoint.input';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChargePointEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([ChargePointEntity], 'default'),
      ],
      // describe the resolvers you want to expose
      resolvers: [
        {
          DTOClass: ChargePointDTO,
          EntityClass: ChargePointEntity,
          CreateDTOClass: ChargePointInputDTO,
          create: { disabled: false },
          update: { disabled: false },
          delete: { disabled: false },
          enableSubscriptions: true,
          enableAggregate: true,
          guards: [JwtAuthGuard],
        },
      ],
    }),
  ],
  exports: [TypeOrmModule],
})
export class GraphqlChargePointModule {}
// console.log(NestjsQueryGraphQLModule.forFeature);
