import { IIpGeolocation } from '@app/entities/interfaces/ip-geolocation.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SessionModel {
  public constructor(partial: Partial<SessionModel>) {
    this.userId = partial.userId;
    this.sessionId = partial.sessionId;
    this.latestActivityDate = partial.latestActivityDate;
    this.ip = partial.ip;
    this.userAgent = partial.userAgent;
    this.geolocation = partial.geolocation;
  }

  @ApiProperty({ type: Number })
  public userId: number;

  @ApiProperty({ type: String })
  public sessionId: string;

  @ApiProperty({ type: Date })
  public latestActivityDate: Date;

  @ApiProperty({ type: String })
  public ip: string;

  @ApiProperty({ type: String })
  public userAgent: string;

  @ApiProperty()
  public geolocation: IIpGeolocation;
}

export class GetAllSessionModel {
  public constructor(partial: Partial<GetAllSessionModel>) {
    this.items =
      partial.items && partial.items?.length > 0
        ? partial.items.map(item => new SessionModel(item))
        : [];
    this.totals = partial.totals;
  }

  public totals: number;
  public items: SessionModel[];
}
