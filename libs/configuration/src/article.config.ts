import { ArticleApiConfigInterface } from './interfaces';
import config from 'config';

export const articleConf: ArticleApiConfigInterface =
  config.get<ArticleApiConfigInterface>('articleApi');
