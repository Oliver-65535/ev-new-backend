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

import { ConnectorEntity } from 'src/common/chargePoint/connector/connector.entity';
import { SiteEntity } from '../../common/site/site/site.entity';
import { UserEntity } from '../user/user.entity';

@Entity('Organization')
export class OrganizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  name!: string;

  @Column({ length: 50, nullable: true })
  email!: string;

  @Column({ length: 50, nullable: true })
  phone_number!: string;

  @Column('geometry')
  location: Point;

  @Column({ length: 128, nullable: true })
  address: string;

  @Column({ type: 'bigint', default: 0 })
  zip_code!: number;

  @OneToMany(() => SiteEntity, (site) => site.organization, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  sites: SiteEntity[];

  @ManyToOne(() => UserEntity, (u) => u.organizations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: UserEntity;

  @Column({ nullable: true })
  ownerId?: number;

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
