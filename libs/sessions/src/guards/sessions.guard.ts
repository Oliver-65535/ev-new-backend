import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionsService } from '@app/sessions/services';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SessionsGuard implements CanActivate {
  constructor(
    private sessionsService: SessionsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );
    if (allowUnauthorizedRequest) {
      return true;
    }
    const response = context.switchToHttp().getResponse<Response>();
    return this.sessionsService.validateRequest(request, response);
  }
}
