import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';

@Entity({ name: 'article-access' })
export class ArticleAccessEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => ArticleEntity)
  article: ArticleEntity;

  @ApiProperty()
  @Column()
  ownerId: number;

  @ApiProperty()
  @OneToOne(() => UserEntity)
  requester: UserEntity;

  @ApiProperty()
  @Column({ nullable: true })
  approve: boolean;
}
