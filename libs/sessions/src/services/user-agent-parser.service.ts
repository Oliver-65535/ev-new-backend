import { Injectable, Logger } from '@nestjs/common';
import { UAParser, IResult } from 'ua-parser-js';
import { Request } from 'express';

@Injectable()
export class UserAgentParserService {
  private readonly logger = new Logger(UserAgentParserService.name, {
    timestamp: true,
  });

  parse(request: Request): IResult {
    try {
      return UAParser(request.headers['user-agent']);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
