import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Request, Response } from 'express';
import { IpDetectionService } from './ip-detection.service';
import { IpGeolocationService } from './ip-geolocation.service';
import { UserAgentParserService } from './user-agent-parser.service';
import { RedisService } from '../../../redis/redis.service';
import { JwtCustomService } from '../../../jwt/jwt.service';
import { GetAllSessionModel } from '@app/sessions/services/models/get-all-session.model';
import { SessionModel } from '../../../../apps/auth/src/models/session.model';
import { IGetAllSessions } from '@app/sessions/services/interfaces';
import { SessionEntity } from '@app/entities/session.entity';
import { ICreateSession } from 'apps/auth/src/interfaces';
import { SessionExpirationTime } from '@app/configuration/session-expiration-time.config';
import { IGetActiveSessions } from 'apps/auth/src/interfaces/get-active-sessions.interface';
import { GetActiveSessionsModel } from 'apps/auth/src/models';
import { SessionTypeEnum } from 'apps/auth/src/enums';
import { RefreshTokenDto } from 'apps/auth/src/dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private ipDetectionService: IpDetectionService,
    private ipGeolocationService: IpGeolocationService,
    private userAgentParserService: UserAgentParserService,
    private jwtCustomService: JwtCustomService,
    private readonly redisService: RedisService,
  ) {}

  isExpired(latestActivityDate: Date): boolean {
    return (
      latestActivityDate < new Date(Date.now() - Number(SessionExpirationTime))
    );
  }

  async createSession(data: ICreateSession): Promise<SessionModel> {
    const { user, request } = data;
    const ip = this.ipDetectionService.getIp(request);
    const geolocation = this.ipGeolocationService.getGeolocationByIp(ip);
    const { ua: userAgent, ...userAgentInfo } =
      this.userAgentParserService.parse(request);

    // if (!data.sessionId && user.isTwoFactorAuthenticationEnabled) {
    //   const sessions = await this.sessionRepository.find({
    //     where: {
    //       userId: user.id,
    //       isSecondFactorAuthenticated: true,
    //     },
    //   });

    //   const sessionId = sessions.pop().sessionId;

    //   const { accessToken, refreshToken, accessTokenExpire } =
    //     await this.jwtCustomService.createTokens({
    //       createdAt: user.createdAt,
    //       username: user.username,
    //       sessionId: sessionId,
    //       userId: user.id,
    //     });

    //   await this.redisService.setTokens({
    //     sessionId: sessionId,
    //     userId: user.id,
    //     accessToken,
    //     refreshToken,
    //   });

    //   throw new HttpException(
    //     {
    //       statusCode: 401,
    //       message: JSON.stringify({
    //         accessToken: accessToken,
    //         sessionId: sessionId,
    //         timestamp: accessTokenExpire,
    //       }),
    //       error: 'Requires second authentication step',
    //     },
    //     401,
    //   );
    // }

    const userSession = await this.sessionRepository.find({
      where: { user: { id: user.id } },
    });

    if (userSession.length === 0) {
      const dataUser = await this.sessionRepository.insert({
        userId: user.id,
        ip,
        userAgent,
        userAgentInfo,
        geolocation,
        active: true,
      });
      const sessionData = dataUser.generatedMaps[0] as SessionEntity;

      const { accessToken, refreshToken, accessTokenExpire } =
        await this.jwtCustomService.createTokens({
          createdAt: user.createdAt,
          username: user.username,
          sessionId: sessionData.sessionId,
          userId: user.id,
        });

      await this.redisService.setTokens({
        sessionId: sessionData.sessionId,
        userId: user.id,
        accessToken,
        refreshToken,
      });

      return new SessionModel({
        accessToken,
        refreshToken,
        timestamp: accessTokenExpire,
      });
    }

    const userIpInSession = userSession.find(session => session.ip === ip);

    if (userIpInSession) {
      const userIsAlreadyExists = await this.redisService.getTokens({
        sessionId: userIpInSession.sessionId,
        userId: user.id,
      });
      const aTokenExisting = userIsAlreadyExists?.accessToken;
      const rTokenExisting = userIsAlreadyExists?.refreshToken;

      if (aTokenExisting) {
        const dateNow = Math.trunc(Date.now() / 1000);
        const decodeToken = await this.jwtCustomService.decodeAccessToken({
          accessToken: userIsAlreadyExists?.accessToken.toString(),
        });

        if (decodeToken?.exp < dateNow) {
          if (userIsAlreadyExists) {
            await this.redisService.deleteTokens({
              sessionId: userIpInSession.sessionId,
              userId: user.id,
            });
          }

          const { accessToken, refreshToken, accessTokenExpire } =
            await this.jwtCustomService.createTokens({
              createdAt: user.createdAt,
              username: user.username,
              sessionId: userIpInSession.sessionId,
              userId: user.id,
            });

          await this.redisService.setTokens({
            sessionId: userIpInSession.sessionId,
            userId: user.id,
            accessToken: accessToken,
            refreshToken,
          });

          await this.sessionRepository.update(
            { sessionId: userIpInSession.sessionId },
            { active: true },
          );

          return new SessionModel({
            accessToken,
            refreshToken,
            timestamp: accessTokenExpire,
          });
        } else {
          await this.sessionRepository.update(
            { sessionId: userIpInSession.sessionId },
            { active: true },
          );
          return new SessionModel({
            accessToken: aTokenExisting,
            refreshToken: rTokenExisting,
            timestamp: decodeToken.exp,
          });
        }
      } else {
        const { accessToken, refreshToken, accessTokenExpire } =
          await this.jwtCustomService.createTokens({
            createdAt: user.createdAt,
            username: user.username,
            sessionId: userIpInSession.sessionId,
            userId: user.id,
          });

        await this.redisService.setTokens({
          sessionId: userIpInSession.sessionId,
          userId: user.id,
          accessToken: accessToken,
          refreshToken,
        });

        await this.sessionRepository.update(
          { sessionId: userIpInSession.sessionId },
          { active: true },
        );

        return new SessionModel({
          accessToken,
          refreshToken,
          timestamp: accessTokenExpire,
        });
      }
    } else if (!userIpInSession) {
      const dataUser = await this.sessionRepository.insert({
        userId: user.id,
        ip,
        userAgent,
        userAgentInfo,
        geolocation,
        active: true,
      });

      const sessionData = dataUser.generatedMaps[0] as SessionEntity;

      const { accessToken, refreshToken, accessTokenExpire } =
        await this.jwtCustomService.createTokens({
          createdAt: user.createdAt,
          username: user.username,
          sessionId: sessionData.sessionId,
          userId: user.id,
        });

      await this.redisService.setTokens({
        sessionId: sessionData.sessionId,
        userId: user.id,
        accessToken,
        refreshToken,
      });

      return new SessionModel({
        accessToken,
        refreshToken,
        timestamp: accessTokenExpire,
      });
    }
  }

  async refreshToken(
    request: Request,
    body: RefreshTokenDto,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    timestamp: number;
  }> {
    const { refreshToken: refreshTokenUser } = body;
    let { authorization: accessTokenUser } = request.headers;

    if (!refreshTokenUser) {
      throw new BadRequestException('Not found token');
    }

    if (!accessTokenUser) {
      throw new BadRequestException('Pass access token in header');
    }

    if (accessTokenUser.startsWith('Bearer ')) {
      accessTokenUser = accessTokenUser.split(' ')[1];
    } else {
      throw new BadRequestException(`Incorrect authentication token`);
    }

    const decodeToken = await this.jwtCustomService.decodeRefreshToken({
      refreshToken: refreshTokenUser.toString(),
    });

    const { sessionId, userId, createdAt, username } = decodeToken;

    const tokens = await this.redisService.getTokens({
      sessionId,
      userId,
    });

    if (!tokens) {
      throw new NotFoundException('Token not found. Please login in system');
    }

    const { accessToken: accessTokenOld, refreshToken: refreshTokenOld } =
      tokens;

    if (
      accessTokenOld !== accessTokenUser ||
      refreshTokenUser !== refreshTokenOld
    ) {
      throw new NotFoundException('Token in system not found!');
    }

    const session = await this.sessionRepository.findOne({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpire,
    } = await this.jwtCustomService.createTokens({
      userId,
      sessionId,
      createdAt,
      username,
    });

    await this.sessionRepository.update(
      {
        sessionId: session.sessionId,
      },
      {
        active: true,
      },
    );

    const tokenRedis = await this.redisService.getTokens({
      sessionId: session.sessionId,
      userId: session.userId,
    });

    if (tokenRedis) {
      await this.redisService.deleteTokens({
        sessionId: session.sessionId,
        userId: session.userId,
      });
    }

    await this.redisService.setTokens({
      sessionId: session.sessionId,
      userId: session.userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      timestamp: accessTokenExpire,
    };
  }

  async authenticateSecondFactor(
    sessionId: string,
    req: Request,
  ): Promise<SessionModel> {
    await this.sessionRepository.update(
      { sessionId },
      { isSecondFactorAuthenticated: true },
    );

    const session = await this.sessionRepository.findOne({
      relations: ['user'],
      where: {
        sessionId,
      },
    });

    const newSession = await this.createSession({
      request: req,
      user: session.user,
      sessionId,
    });

    return newSession;
  }

  async deauthenticateSecondFactorOnAllActiveSessions(
    userId: number,
  ): Promise<void> {
    await this.sessionRepository.update(
      { userId, active: true },
      { isSecondFactorAuthenticated: false },
    );
  }

  async getActiveSessions(
    data: IGetActiveSessions,
    currentSession: SessionEntity,
  ): Promise<GetActiveSessionsModel> {
    const { filter, sortBy, skip, limit } = data;
    const sessionsUser = await this.sessionRepository.find({
      where: { userId: currentSession.userId },
      order: { updatedAt: sortBy },
    });
    const sessions = sessionsUser.map(session => {
      const sessionId = session.sessionId;
      let status: SessionTypeEnum;
      const { ip, geolocation, userAgent, active, updatedAt } = session;
      if (active) {
        status = SessionTypeEnum.ACTIVE;
      }
      if (!active) {
        status = SessionTypeEnum.TERMINATED;
      }
      if (currentSession.sessionId == sessionId) {
        status = SessionTypeEnum.CURRENT;
      }

      return {
        id: sessionId,
        ip,
        geolocation,
        userAgent,
        status,
        lastActivity: updatedAt,
      };
    });

    if (filter == SessionTypeEnum.ALL) {
      const res = sessions.slice(skip, skip + limit);
      return new GetActiveSessionsModel({
        items: res,
        totals: sessions.length,
      });
    }

    const resultFilter = sessions.filter(session => session.status == filter);
    const resultPagination = resultFilter.slice(skip, skip + limit);
    return new GetActiveSessionsModel({
      items: resultPagination,
      totals: resultFilter.length,
    });
  }

  async getSessionById(sessionId: string): Promise<SessionEntity> {
    return this.sessionRepository.findOne({
      where: { sessionId },
      relations: { user: true },
    });
  }

  async prolongSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update({ sessionId }, { active: true });
  }

  async terminateSession(
    outerId: string,
    session: SessionEntity,
  ): Promise<string> {
    if (outerId === session.outerId) {
      throw new BadRequestException(
        'Unable to terminate current session. Please use logout',
      );
    }
    const deleteSession = await this.sessionRepository.findOne({
      where: { sessionId: outerId },
    });

    if (!deleteSession) {
      throw new NotFoundException('Session not found');
    }

    await this.endSession(
      deleteSession.outerId,
      session.user.id,
      deleteSession.sessionId,
    );

    return `Session ${outerId} terminated`;
  }

  async endSession(
    outerId: string,
    userId: number,
    sessionId: string,
  ): Promise<void> {
    await this.redisService.deleteTokens({ sessionId, userId });
    await this.sessionRepository.update({ outerId, userId }, { active: false });
  }

  async validateRequest(
    request: Request,
    response: Response,
    // onlyFirstFactor?: boolean,
  ): Promise<boolean> {
    let accessTokenAuth = request.headers.authorization;
    if (!accessTokenAuth) {
      throw new BadRequestException('Token not found in headers');
    }
    if (accessTokenAuth.startsWith('Bearer ')) {
      accessTokenAuth = accessTokenAuth.split(' ')[1];
    } else {
      throw new BadRequestException(`Incorrect authentication token`);
    }

    const decodeToken = await this.jwtCustomService.decodeAccessToken({
      accessToken: accessTokenAuth.toString(),
    });

    const { sessionId, userId, exp: expToken } = decodeToken;

    const tokens = await this.redisService.getTokens({
      sessionId,
      userId,
    });

    if (!tokens) {
      throw new BadRequestException('You need to log in.');
    }

    let session;
    try {
      session = (await this.sessionRepository.findOneOrFail({
        where: { sessionId, active: true },
        relations: { user: true },
      })) as SessionEntity;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(`Incorrect authentication token`);
      }
    }
    // if (!onlyFirstFactor) {
    //   try {
    //     session = (await this.sessionRepository.findOneOrFail({
    //       where: { sessionId, active: true },
    //       relations: { user: true },
    //     })) as SessionEntity;
    //   } catch (error) {
    //     if (error instanceof QueryFailedError) {
    //       throw new BadRequestException(`Incorrect authentication token`);
    //     }
    //   }
    // } else {
    //   try {
    //     session = (await this.sessionRepository.findOneOrFail({
    //       where: { sessionId, isSecondFactorAuthenticated: true, userId },
    //       relations: { user: true },
    //     })) as SessionEntity;
    //   } catch (error) {
    //     if (error instanceof QueryFailedError) {
    //       throw new BadRequestException(`Incorrect authentication token`);
    //     }
    //   }
    // }

    if (!session) {
      throw new NotFoundException(
        `Active session ${sessionId} not found on server`,
      );
    }

    const { accessToken } = tokens;

    if (accessToken !== accessTokenAuth) {
      throw new BadRequestException('token uncorrected');
    }

    const dateNow = Math.trunc(Date.now() / 1000);
    if (expToken < dateNow) {
      throw new UnauthorizedException('Token expired');
    }

    // if (!onlyFirstFactor) {
    //   if (
    //     session.user.isTwoFactorAuthenticationEnabled &&
    //     !session.isSecondFactorAuthenticated
    //   ) {
    //     throw new BadRequestException(
    //       `Session ${sessionId} requires second authentication step`,
    //     );
    //   }
    // }

    await this.prolongSession(sessionId);
    request['session'] = session;
    return true;
  }

  public async getAllActiveSessions(
    filter: IGetAllSessions,
    userId: number,
  ): Promise<GetAllSessionModel> {
    const { limit, skip, sortBy } = filter;

    const [activeSession, totalSessions] = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.active = true')
      .andWhere('session.userId = :userId', { userId })
      .select([
        'session.userId',
        'session.sessionId',
        'session.latestActivityDate',
        'session.ip',
        'session.userAgent',
        'session.geolocation',
      ])
      .skip(skip)
      .take(limit)
      .orderBy('session.created_at', sortBy)
      .getManyAndCount();

    return new GetAllSessionModel({
      items: activeSession,
      totals: totalSessions,
    });
  }

  public async downSession({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: number;
  }): Promise<boolean> {
    const session = await this.redisService.getTokens({ sessionId, userId });
    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const resultUpdate = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.session_id = :sessionId', { sessionId })
      .andWhere('session.user_id = :userId', { userId })
      .update({ active: false })
      .output(['active'])
      .execute();

    if (resultUpdate.raw[0].active === true) {
      throw new InternalServerErrorException('Session was not updated');
    }

    await this.redisService.deleteTokens({ sessionId, userId });
    return true;
  }
}
