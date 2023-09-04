import { BaseUserModel } from '@app/sessions/services/models/base-user.model';

export class GetNewUsersByPeriodModel {
  public constructor(partial: Partial<GetNewUsersByPeriodModel>) {
    this.items =
      partial.items && partial.items.length > 0
        ? partial.items.map(item => new BaseUserModel(item))
        : [];
    this.totals = partial.totals;
  }

  public items: BaseUserModel[];

  public totals: number;
}
