import { Lookup } from 'geoip-lite';

export interface IIpGeolocation
  extends Omit<Lookup, 'range' | 'eu' | 'metro' | 'area'> {}
