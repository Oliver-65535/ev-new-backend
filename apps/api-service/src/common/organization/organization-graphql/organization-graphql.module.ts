import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { OrganizationDTO } from './dto/organization.dto';
import { OrganizationEntity } from '@app/entities';
import { OrganizationInputDTO } from './dto/organization.input';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([OrganizationEntity], 'default'),
      ],
      // describe the resolvers you want to expose
      resolvers: [
        {
          DTOClass: OrganizationDTO,
          EntityClass: OrganizationEntity,
          CreateDTOClass: OrganizationInputDTO,
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
export class GraphqlOrganizationModule {}
// console.log(NestjsQueryGraphQLModule.forFeature);
