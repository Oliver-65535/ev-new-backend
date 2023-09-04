import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, unique: true })
  address?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, unique: true })
  username?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Exclude()
  @Column({ nullable: true, name: 'password_hash' })
  passwordHash?: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  publicKey: string;

  @ApiProperty({ nullable: true, isArray: true })
  @ManyToMany(() => ArticleEntity, { nullable: true })
  bougth?: ArticleEntity[];

  @ApiProperty()
  @OneToMany(() => ArticleEntity, article => article.owner, { nullable: true })
  owned?: ArticleEntity[];
}
