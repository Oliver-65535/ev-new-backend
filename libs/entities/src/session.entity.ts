import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { IIpGeolocation } from './interfaces/ip-geolocation.interface';
import { IUserAgentInfo, UserAgentInfoResponseDto } from './interfaces/user-agent-parsed-info.interface';

@Entity({ name: 'session' })
export class SessionEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid', { name: 'session_id' })
  sessionId: string;

  @Column({ name: 'refresh_token', nullable: true, default: null })
  refreshToken: string;

  @ApiProperty()
  @Column({ name: 'outer_id' })
  @Generated('uuid')
  outerId: string;

  @ApiProperty()
  @Column({ nullable: false, name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty()
  @Column({ type: 'bool', nullable: false, default: true })
  active: boolean;

  @ApiProperty()
  @Column({
    type: 'bool',
    name: 'is_second_factor_authenticated',
    nullable: false,
    default: false,
  })
  isSecondFactorAuthenticated: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'login_date' })
  loginDate: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'last_activity_date' })
  latestActivityDate: Date;

  @ApiProperty()
  @Column({ type: 'varchar' })
  ip: string;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'user_agent' })
  userAgent: string;

  @ApiProperty({ type: UserAgentInfoResponseDto })
  @Column({ type: 'jsonb', name: 'user_agent_info', nullable: true })
  userAgentInfo: IUserAgentInfo;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  geolocation: IIpGeolocation;
}
