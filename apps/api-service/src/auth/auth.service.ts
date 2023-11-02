import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { UserEntity, UserRole } from '@app/entities';
import {
  LoginResponseDTO,
  SendCodeResponseDTO,
} from './dto/login-response.dto';
import { AuthenticatedUser, JwtPayload } from './auth.interfaces';
import { UserDTO } from '../common/user/user-graphql/dto/user.dto';
import { LoginInputDTO, SendCodeLoginInputDTO } from './dto/login-input.dto';
import { RedisService } from 'libs/redis/redis.service';
import { generateRandomCode } from '../utils/verification';
import { MessageBirdService } from 'libs/SMS/messagebird/message-bird.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from 'libs/mailer/src/mailer.service';

import { mailerConf, emailConfirmConf } from '@app/configuration';
import { emailVerificationTemplateHtml } from 'libs/mailer/email-templates/email-verification-code.template';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueryService(UserEntity)
    private usersService: QueryService<UserEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly messageBirdService: MessageBirdService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthenticatedUser | null> {
    const [user] = await this.usersService.query({
      filter: { username: { eq: username } },
      paging: { limit: 1 },
    });

    // const user = { id: 1, username: 'user', password: 'pass' };

    // dont use plain text passwords in production!
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendCodeLogin(
    input: SendCodeLoginInputDTO,
  ): Promise<SendCodeResponseDTO> {
    const code = generateRandomCode(6);

    const isPhone = input.phone?.length > 8 ? true : false;
    const account = isPhone ? input.phone : input.email;
    console.log({ isPhone, phone: input.phone });

    if (isPhone) {
      // console.log('phone verfication');
      const sendedCode = await this.messageBirdService.sendMessage({
        recipient: input.phone,
        message: `Verfication code:${code}`,
      });
    } else {
      await this.mailerService.sendMail({
        from: `<${mailerConf.user}>`,
        to: input.email,
        subject: emailConfirmConf.emailConfirmationSubject,
        text: ``,
        html: emailVerificationTemplateHtml({ code }),
      });
      // console.log('email verfication');
    }

    const setRedis = await this.redisService.setRedisData(
      `login-verification-code-${account}`,
      code,
    );
    console.log({ code });
    return { status: setRedis == 'OK' ? 'Accepted' : setRedis };
  }

  async login(input: LoginInputDTO): Promise<LoginResponseDTO> {
    const isPhone = input.phone?.length > 8 ? true : false;
    const account = isPhone ? input.phone : input.email;
    // console.log({ account });

    const loginVerficationCode = await this.redisService.getRedisData(
      `login-verification-code-${account}`,
    );

    if (input.code == loginVerficationCode) {
      const options = isPhone ? { phone: input.phone } : { email: input.email };
      let user = await this.userEntityRepository.findOne({ where: options });
      if (!user) {
        const newUser = await this.userEntityRepository.create(options);
        user = await this.userEntityRepository.save({
          ...newUser,
          role: isPhone ? UserRole.END_USER : UserRole.BUSINESS_OWNER,
        });
      }
      await this.redisService.delRedisData(
        `login-verification-code-${account}`,
      );
      return await this.getAccessToken(user);
    } else {
      throw new UnauthorizedException('Incorrect verification code!');
    }
  }

  async currentUser(authUser: AuthenticatedUser): Promise<UserDTO> {
    try {
      const user = await this.usersService.getById(authUser.id);
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async getAccessToken(
    user: AuthenticatedUser,
  ): Promise<LoginResponseDTO> {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      accessToken: this.jwtService.sign(payload),
    });
  }
}
