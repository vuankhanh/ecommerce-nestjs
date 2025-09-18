export interface IConfiguration {
  isProduction: boolean;
  app: {
    port: number;
  };
  endpoint: string;
  db: IUrl;
  redis: IUrl;
  printer: IUrl;
  client: IUrl;
  folder?: {
    album: string;
  };
}

export interface IUrl {
  protocol: string;
  host: string;
  port: number;
  path?: string;
}
