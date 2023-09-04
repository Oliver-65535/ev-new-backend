import { readFileSync } from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';
import { IDatabaseConfig } from './interfaces';

const coreDbConfig = config.get<IDatabaseConfig>('database');

export const postgresConfiguration: TypeOrmModuleOptions = {
  host: coreDbConfig.host,
  port: coreDbConfig.port,
  username: coreDbConfig.username,
  password: coreDbConfig.password,
  database: coreDbConfig.database,
  logging: false,
  autoLoadEntities: true,
  synchronize: true,
  ssl: coreDbConfig.sslOn
    ? {
        ca: readFileSync(coreDbConfig.ssl?.ca, 'utf-8'),
        key: coreDbConfig.ssl?.key
          ? readFileSync(coreDbConfig.ssl?.key, 'utf-8')
          : null,
        cert: coreDbConfig.ssl?.cert
          ? readFileSync(coreDbConfig.ssl?.cert, 'utf-8')
          : null,
      }
    : null,
};

Object.assign(postgresConfiguration, { type: coreDbConfig.type });
