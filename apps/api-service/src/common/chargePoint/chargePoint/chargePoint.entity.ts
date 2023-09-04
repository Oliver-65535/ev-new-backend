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

import { ConnectorEntity } from '../connector/connector.entity';
import { Point } from 'geojson';
import { SiteEntity } from 'src/common/site/site/site.entity';
import { UserEntity } from 'src/common/user/user.entity';

@Entity('ChargePoint')
export class ChargePointEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 64, nullable: true })
  chargePointHardwareId: string;

  @Column({ length: 128, default: 'Not set' })
  chargePointName: string;

  @Column({ length: 50, default: 'Disconnected' })
  status: string;

  // @Column('geometry')
  // location: Point;

  @OneToMany(() => ConnectorEntity, (connectors) => connectors.chargePoint, {onDelete: 'CASCADE'})
  connectors: ConnectorEntity[];

  @ManyToOne(() => SiteEntity, (site) => site.chargePoints,{onDelete: 'CASCADE'})
  site: SiteEntity;

  @Column({ nullable: true })
  siteId?: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  instantPower: number;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  power: number;

  @Column({ default: false })
  public: boolean;

  @ManyToOne(() => UserEntity, (u) => u.chargePoints, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: UserEntity;

  @Column({ nullable: true })
  ownerId?: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  ocpp_event_timestamp: Date; // Creation date

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
