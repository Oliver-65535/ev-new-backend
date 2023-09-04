import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChargePointEntity } from '../chargePoint/chargePoint/chargePoint.entity';
import { ConnectorEntity } from '../chargePoint/connector/connector.entity';
import { OrganizationEntity } from '../organization/organization.entity';
import { Role } from '../../enums/role.enum';
import { SiteEntity } from '../site/site/site.entity';

export enum UserRole {
  END_USER = 'end-user',
  BUSINESS_OWNER = 'business-owner',
}

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ unique: true, length: 64, nullable: true })
  username: string;

  @Column({ unique: true, length: 64, nullable: true })
  phone: string;

  @Column({ unique: true, length: 64, nullable: true })
  email: string;

  @Column({ length: 64, nullable: true })
  password: string;

  @Column({ length: 64, default: '' })
  country: string;

  @Column({ length: 64, default: '' })
  state: string;

  @Column({ length: 64, default: '' })
  address: string;

  @Column({ length: 64, default: '' })
  unit: string;

  @Column({ length: 64, default: '' })
  city: string;

  @Column({ nullable: true })
  zip: number;

  @Column({ name: 'balance', default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: ['end-user', 'business-owner'],
    default: 'end-user',
  })
  role: UserRole;

  // @Column({ type: 'enum', enum: Role, default: Role.Guest })
  // role: Role;

  @OneToMany(() => OrganizationEntity, (organization) => organization.owner)
  @JoinTable()
  organizations!: OrganizationEntity[];

  @OneToMany(() => SiteEntity, (site) => site.owner)
  @JoinTable()
  sites!: SiteEntity[];

  @OneToMany(() => ChargePointEntity, (chargePoint) => chargePoint.owner)
  @JoinTable()
  chargePoints!: ChargePointEntity[];

  @OneToMany(() => ConnectorEntity, (connector) => connector.owner)
  @JoinTable()
  connectors!: ConnectorEntity[];

  @Column({ default: false })
  is_active: boolean;
}
