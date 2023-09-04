import { IIpGeolocation } from '@app/entities/interfaces';
import { SessionTypeEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

class SessionPresenter {
  public constructor(partial: Partial<SessionPresenter>) {
    this.id = partial.id;
    this.ip = partial.ip;
    this.geolocation = partial.geolocation;
    this.userAgent = partial.userAgent;
    this.status = partial.status;
    this.lastActivity = partial.lastActivity;
  }

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public ip: string;

  @ApiProperty({ type: String })
  public geolocation: IIpGeolocation;

  @ApiProperty({ type: String })
  public userAgent: string;

  @ApiProperty()
  public lastActivity: Date;

  @ApiProperty({
    type: SessionTypeEnum,
    enum: SessionTypeEnum,
    enumName: 'SessionTypeEnum',
  })
  public status: SessionTypeEnum;
}

export class GetActiveSessionsPresenter {
  public constructor(partial: Partial<GetActiveSessionsPresenter>) {
    this.items =
      partial.items && partial.items?.length > 0
        ? partial.items.map(item => new SessionPresenter(item))
        : [];
    this.totals = partial.totals;
  }

  @ApiProperty({ type: [SessionPresenter] })
  public items: SessionPresenter[];

  @ApiProperty({ type: Number })
  public totals: number;
}
