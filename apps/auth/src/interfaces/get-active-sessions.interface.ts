import { SessionTypeEnum } from '../enums';
import { SortByEnum } from '@app/common/filters/sort-by.enum';

export interface IGetActiveSessions {
  filter: SessionTypeEnum;

  sortBy: SortByEnum;
  limit: number;
  skip: number;
}
