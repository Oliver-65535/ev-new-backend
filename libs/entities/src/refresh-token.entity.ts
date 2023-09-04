import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '@app/entities';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @PrimaryColumn({ nullable: false, unique: true })
  token: string;
}
