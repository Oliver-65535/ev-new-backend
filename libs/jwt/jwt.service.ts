import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { CreateTokensModel, DecodeTokenModel } from './models';
import {
  ICreateTokens,
  IDecodeAccessToken,
  IDecodeRefreshToken,
} from './interfaces';
import { jwtConfig } from '@app/configuration';
import { DateExpireTokenEnum } from './enums';
import { getFutureDays, getFutureHours } from '@app/common/date-functions';

@Injectable()
export class JwtCustomService {
  public constructor(private jwtService: JwtService) {}

  public async decodeAccessToken(
    data: IDecodeAccessToken,
  ): Promise<DecodeTokenModel> {
    const { accessToken } = data;
    const decodeToken = (await this.jwtService.decode(
      accessToken.toString(),
    )) as DecodeTokenModel;

    if (!decodeToken) {
      throw new BadRequestException('Access token uncorrected');
    }

    return new DecodeTokenModel(decodeToken);
  }

  public async decodeRefreshToken(
    data: IDecodeRefreshToken,
  ): Promise<DecodeTokenModel> {
    const { refreshToken } = data;
    const decodeToken = (await this.jwtService.decode(
      refreshToken.toString(),
    )) as DecodeTokenModel;

    if (!decodeToken) {
      throw new BadRequestException('Refresh token uncorrected');
    }

    return new DecodeTokenModel(decodeToken);
  }

  public async createTokens(data: ICreateTokens): Promise<CreateTokensModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...data },
        {
          secret: jwtConfig.nonce.secret,
          expiresIn: jwtConfig.accessTokenExpire,
        },
      ),
      this.jwtService.signAsync(
        { ...data },
        {
          secret: jwtConfig.nonce.secret,
          expiresIn: jwtConfig.refreshTokenExpire,
        },
      ),
    ]);

    const accessTokenExpire = await this._getTimeTokenExpire(
      jwtConfig.accessTokenExpire,
    );
    return new CreateTokensModel({
      accessToken,
      refreshToken,
      accessTokenExpire,
    });
  }

  private async _getTimeTokenExpire(timeToken: string): Promise<number> {
    if (timeToken.includes(DateExpireTokenEnum.HOUR)) {
      const hours = Number(timeToken.split(DateExpireTokenEnum.HOUR)[0]);
      const result = await getFutureHours(hours);
      return result;
    } else if (timeToken.includes(DateExpireTokenEnum.DAY)) {
      const days = Number(timeToken.split(DateExpireTokenEnum.DAY)[0]);
      const result = await getFutureDays(days);
      return result;
    }

    throw new Error(
      'The lifetime of the token in the config file is not correctly defined',
    );
  }
}
