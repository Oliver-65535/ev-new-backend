import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { LoginDto, RegistrationDto } from './interface/auth.dto';
import { SessionsService } from '@app/sessions';
import { Request } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post('register')
  async register(@Body() body: RegistrationDto) {
    return await this.authenticationService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Req() request: Request) {
    const user = await this.authenticationService.login(
      body.username,
      body.password,
    );

    const { accessToken, refreshToken, timestamp } =
      await this.sessionsService.createSession({ request, user });

    return { user, accessToken, refreshToken, timestamp };
  }
}
