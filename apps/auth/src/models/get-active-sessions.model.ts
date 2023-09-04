import { IIpGeolocation } from '@app/entities/interfaces/ip-geolocation.interface';
import { SessionTypeEnum } from '../enums';

class SessionModel {
  public constructor(partial: Partial<SessionModel>) {
    this.id = partial.id;
    this.ip = partial.ip;
    this.geolocation = partial.geolocation;
    this.userAgent = partial.userAgent;
    this.status = partial.status;
    this.lastActivity = partial.lastActivity;
  }

  public id: string;
  public ip: string;
  public geolocation: IIpGeolocation;
  public userAgent: string;
  public status: SessionTypeEnum;
  public lastActivity: Date;
}

export class GetActiveSessionsModel {
  public constructor(partial: Partial<GetActiveSessionsModel>) {
    this.items =
      partial.items && partial.items?.length > 0
        ? partial.items.map(item => new SessionModel(item))
        : [];
    this.totals = partial.totals;
  }
  public items: SessionModel[];
  public totals: number;
}
