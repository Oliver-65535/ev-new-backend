import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'nonce_token' })
export class NonceTokenEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  token: string;

  @PrimaryColumn({ nullable: false, unique: true })
  address: string;

  @CreateDateColumn()
  created_at: Date;
}
