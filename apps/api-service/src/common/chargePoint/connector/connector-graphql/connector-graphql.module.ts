import { ConnectorDTO } from './dto/connector.dto';
import { ConnectorEntity } from '@app/entities';
import { ConnectorInputDTO } from './dto/connector.input';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectorEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([ConnectorEntity], 'default'),
      ],
      // describe the resolvers you want to expose
      resolvers: [
        {
          DTOClass: ConnectorDTO,
          EntityClass: ConnectorEntity,
          CreateDTOClass: ConnectorInputDTO,
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
export class GraphqlConnectorModule {}
// console.log(NestjsQueryGraphQLModule.forFeature);
