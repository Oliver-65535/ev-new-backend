import {
    AuthService,
    EthLogInDto,
    JwtAuthGuard,
    LogInResponseDto,
  } from '@app/auth-wallet';
  import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ErrorResponse } from '@app/common';
  import {
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
  } from '@nestjs/swagger';
  import { EthNonceDto } from '@app/auth-wallet/dto/eth-nonce.dto';
  import { EthNonceResponseDto } from '@app/auth-wallet/dto/eth-nonce.response.dto';
  import { User } from '../decorators/user.decorator';
  import { UserEntity } from '@app/entities';
  
  @ApiTags('Auth')
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
  })
  @Controller('auth')
  export class AuthWalletController {
    constructor(private readonly authService: AuthService) {}
  
    @ApiOperation({
      summary: 'Get nonce for login',
    })
    @ApiOkResponse({
      type: EthNonceResponseDto,
    })
    @Post('nonce')
    async nonce(@Body() dto: EthNonceDto) {
      return this.authService.ethNonce(dto);
    }
  
    @ApiOperation({
      summary: 'Login with metamask',
    })
    @ApiOkResponse({
      type: LogInResponseDto,
    })
    @Post('login')
    async login(@Body() dto: EthLogInDto) {
      return this.authService.ethLogin(dto);
    }
  
    @ApiOperation({
      summary: 'Refresh tokens',
    })
    @ApiOkResponse({
      type: LogInResponseDto,
    })
    @Patch(':refreshToken')
    async refresh(@Param('refreshToken') refreshToken: string) {
      return this.authService.refresh(refreshToken);
    }
  
    @ApiBearerAuth()
    @ApiOkResponse({})
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@User() user: UserEntity) {
      return this.authService.logout(user);
    }
  
    @Get('Fall')
    async () {
      return this.authService.fall();
    }
  }
  