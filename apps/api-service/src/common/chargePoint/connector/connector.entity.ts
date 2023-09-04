import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargePointEntity } from '../chargePoint/chargePoint.entity';
import { SiteEntity } from 'src/common/site/site/site.entity';
import { UserEntity } from 'src/common/user/user.entity';

@Entity('Connector')
export class ConnectorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, default: 'None' })
  label: string;

  @Column({ nullable: true })
  connectorId!: number;

  @Column({ length: 50, nullable: true })
  chargePointHardwareId!: string;

  @Column({ length: 50, nullable: true })
  connectorTypeName: string;

  @Column({ length: 50, nullable: true })
  connectorTypeId: string;

  @Column({ default: 0 })
  statusId: number;

  @Column({ length: 50, default: 'Faulted' })
  statusName: string;

  @Column({ length: 128, default: 'None' })
  information: string;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  instantPower: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  power: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  maxPower: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  price: number;

  @Column({ length: 10, default: '$/kWh' })
  priceUnit: string;

  @Column({ type: 'decimal', precision: 5, scale: 3, default: 0 })
  consumption: number;

  @Column({ type: 'decimal', precision: 4, scale: 3, default: 0 })
  inactivity: number;

  @ManyToOne(() => ChargePointEntity, (chargePoint) => chargePoint.connectors,{onDelete: 'CASCADE'})
  chargePoint: ChargePointEntity;

  @Column({ nullable: true })
  chargePointId?: number;

  @ManyToOne(() => SiteEntity, (site) => site.connectors,{onDelete: 'CASCADE'})
  site: SiteEntity;

  @Column({ nullable: true })
  siteId?: number;

  @ManyToOne(() => UserEntity, (u) => u.connectors, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: UserEntity;

  @Column({ nullable: true })
  ownerId: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  ocpp_event_timestamp: Date; // Creation date

  @Column({ default: false })
  booked: boolean;

  @Column({ default: false })
  softBooked: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  bookedAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  bookedUntil?: Date;

  @Column({ nullable: true })
  bookedBy?: number;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'bookedBy' })
  bookedByUser: UserEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date; // Creation date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
