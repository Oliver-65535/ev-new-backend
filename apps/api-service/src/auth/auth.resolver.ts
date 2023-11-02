import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginResponseDTO,
  SendCodeResponseDTO,
} from './dto/login-response.dto';
import { LoginInputDTO, SendCodeLoginInputDTO } from './dto/login-input.dto';
import { UserDTO } from '../common/user/user-graphql/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedUser } from './auth.interfaces';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // @Mutation(() => LoginResponseDTO)
  // async login(@Args('input') input: LoginInputDTO): Promise<LoginResponseDTO> {
  //   const user = await this.authService.validateUser(
  //     input.username,
  //     input.password,
  //   );
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return this.authService.login(user);
  // }

  @Mutation(() => SendCodeResponseDTO)
  async sendCodeLogin(
    @Args('input') input: SendCodeLoginInputDTO,
  ): Promise<SendCodeResponseDTO> {
    const response = this.authService.sendCodeLogin(input);
    return { status: 'Accepted' }; //this.authService.login(user);
  }

  @Mutation(() => LoginResponseDTO)
  async login(@Args('input') input: LoginInputDTO): Promise<LoginResponseDTO> {
    return this.authService.login(input);
  }

  // @Mutation(() => LoginResponseDTO)
  // async loginB2C(
  //   @Args('input') input: SendCodeB2BLoginInputDTO,
  // ): Promise<LoginResponseDTO> {
  //   return { accessToken: 'Accepted' }; //this.authService.login(user);
  // }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserDTO)
  me(@CurrentUser() user: AuthenticatedUser): Promise<UserDTO> {
    return this.authService.currentUser(user);
  }
}
