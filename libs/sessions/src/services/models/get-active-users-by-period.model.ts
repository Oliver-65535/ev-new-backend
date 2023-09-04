import { ApiProperty } from '@nestjs/swagger';
import { BaseUserModel } from '@app/sessions/services/models/base-user.model';

export class GetActiveUsersByPeriodModel {
  public constructor(partial: Partial<GetActiveUsersByPeriodModel>) {
    this.items =
      partial.items && partial.items.length > 0
        ? partial.items.map(item => new BaseUserModel(item))
        : [];
    this.totals = partial.totals;
  }

  @ApiProperty()
  public items: BaseUserModel[];

  @ApiProperty()
  public totals: number;
}
