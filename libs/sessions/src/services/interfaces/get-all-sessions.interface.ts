import { SortByEnum } from '@app/common';

export class IGetAllSessions {
  limit: number;
  skip: number;
  sortBy: SortByEnum = SortByEnum.DESC;
}
