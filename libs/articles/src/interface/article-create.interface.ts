import { UserEntity } from '@app/entities';
import { IGraph } from '@app/entities/interfaces';

export interface ICreateArticleRecord {
  ownerId: number;
  articleUrl?: string;
  graph?: IGraph;
  additionalData?: any;
}
