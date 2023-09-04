import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { IGraph } from './interfaces';

@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => UserEntity, user => user.owned, { nullable: false })
  owner: UserEntity;

  @ApiProperty()
  @Column({ nullable: true })
  articleUrl?: string;

  @ApiProperty()
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  graph?: IGraph;

  @ApiProperty()
  @ManyToMany(() => UserEntity, { nullable: true })
  buyers?: UserEntity[];

  @ApiProperty()
  @Column({ nullable: true, type: 'jsonb' })
  additionalData?: any;
}
