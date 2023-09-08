
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

export = [
  {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    name: 'default',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    keepConnectionAlive: true,
  } as TypeOrmModuleOptions,
  // {
  //   type: 'postgres',
  //   host: process.env.BILLING_DATABASE_HOST,
  //   port: Number(process.env.BILLING_DATABASE_PORT),
  //   username: process.env.BILLING_DATABASE_USERNAME,
  //   password: process.env.BILLING_DATABASE_PASSWORD,
  //   database: process.env.BILLING_DATABASE_NAME,
  //   name: 'billing',
  //   entities: [SessionHistoryEntity],
  //   synchronize: true,
  //   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  //   cli: {
  //     migrationsDir: 'src/migrations',
  //   },
  //   keepConnectionAlive: true,
  // } as TypeOrmModuleOptions,
];
