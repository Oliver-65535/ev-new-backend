import { Injectable, Logger } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';
import { Request } from 'express';

@Injectable()
export class IpDetectionService {
  private readonly logger = new Logger(IpDetectionService.name, {
    timestamp: true,
  });

  getIp(request: Request): string {
    try {
      return getClientIp(request);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
