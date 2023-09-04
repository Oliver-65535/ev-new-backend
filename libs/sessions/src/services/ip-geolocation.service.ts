import { IIpGeolocation } from '@app/entities/interfaces/ip-geolocation.interface';
import { Injectable, Logger } from '@nestjs/common';
import { lookup } from 'geoip-lite';

@Injectable()
export class IpGeolocationService {
  private readonly logger = new Logger(IpGeolocationService.name, {
    timestamp: true,
  });

  getGeolocationByIp(ip: string): IIpGeolocation {
    try {
      return lookup(ip);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
