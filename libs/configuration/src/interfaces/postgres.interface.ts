export interface SslDataInterface {
  readonly ca: string;
  readonly key: string;
  readonly cert: string;
}

type ConnectionOptionsType =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'sqljs'
  | 'mongodb'
  | 'aurora-data-api'
  | 'aurora-data-api-pg'
  | 'expo'
  | 'better-sqlite3'
  | undefined;

export interface IDatabaseConfig {
  readonly type: ConnectionOptionsType;
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  synchronize: boolean;
  readonly sslOn?: boolean;
  readonly ssl?: SslDataInterface;
}
