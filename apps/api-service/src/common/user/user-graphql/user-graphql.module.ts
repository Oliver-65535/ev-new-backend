import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import { UserEntity } from 'src/common/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity], 'default')],
      // describe the resolvers you want to expose
      resolvers: [
        {
          DTOClass: UserDTO,
          EntityClass: UserEntity,
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
export class GraphqlUserModule {}
// console.log(NestjsQueryGraphQLModule.forFeature);
