import { ChargingHistoryDTO } from './dto/charging-history.dto';
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { SessionHistoryEntity } from '@app/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionHistoryEntity], 'billing'),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([SessionHistoryEntity], 'billing'),
      ],
      // describe the resolvers you want to expose
      resolvers: [
        {
          DTOClass: ChargingHistoryDTO,
          EntityClass: SessionHistoryEntity,
          create: { disabled: false },
          update: { disabled: false },
          delete: { disabled: false },
          enableSubscriptions: true,
          enableAggregate: true,
        },
      ],
    }),
  ],
  exports: [TypeOrmModule],
})
export class GraphqlChargingHistoryModule {}
// console.log(NestjsQueryGraphQLModule.forFeature);
