import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SessionHistory')
export class SessionHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  transactionId?: string;

  @Column({ length: 128, nullable: true })
  chargePointHardwareId: string;

  @Column({ nullable: true })
  connectorId?: number;

  @Column({ nullable: true })
  userId?: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  meterStart: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  meterStop: number;

  // @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  // batteryCharged: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  session_start: Date; // Creation date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'NULL',
  })
  session_end: Date; // Creation date
}
