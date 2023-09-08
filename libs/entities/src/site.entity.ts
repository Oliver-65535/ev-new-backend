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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Geometry, Point } from 'geojson';

import { ChargePointEntity } from './charger.entity';
import { ConnectorEntity } from './connector.entity';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

@Entity('Site')
export class SiteEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  name!: string;

  @Column({ length: 50, nullable: true })
  site: string;

  @Column({ length: 50, nullable: true })
  site_area: string;

  @Column('geometry')
  location: Point;

  @Column({ length: 128, nullable: true })
  address: string;

  @Column({ type: 'bigint', default: 0 })
  zip_code!: number;

  @Column({ length: 32, nullable: true })
  phone_number: string;

  @Column({ type: 'decimal', precision: 6, scale: 3, default: 0 })
  default_price: number;

  @Column({ length: 50, nullable: true })
  dynamic_asset: string;

  @Column({ length: 128, nullable: true })
  asset_type: string;

  @Column({ nullable: true })
  instant_power: number;

  @Column({ length: 50, nullable: true })
  battery: string;

  @OneToMany(() => ChargePointEntity, (chargePoint) => chargePoint.site, {onDelete: 'CASCADE'})
  chargePoints: ChargePointEntity[];

  @OneToMany(() => ConnectorEntity, (connectors) => connectors.site,{onDelete: 'CASCADE'})
  connectors: ConnectorEntity[];

  @ManyToOne(() => OrganizationEntity, (organization) => organization.sites)
  organization: OrganizationEntity;

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => UserEntity, (u) => u.sites, {
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
