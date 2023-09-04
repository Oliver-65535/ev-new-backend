export interface IMicroservice {
  readonly url: string;
  readonly port: string;
  readonly shutdownHooks?: boolean;
  readonly standardResponse?: boolean;
}

export interface IMicroservicesConfig {
  auth: IMicroservice;
  articleApi: IMicroservice;
  fileStore: IMicroservice;
  buyModule: IMicroservice;
}

export type AppKey = keyof IMicroservicesConfig;
