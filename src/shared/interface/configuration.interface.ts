export interface IConfiguration {
  app: IUrl;
  db: IUrl;
  printer: IUrl;
  client: IUrl;
  folder?: {
    album: string;
  }
}

export interface IUrl {
  protocol: string;
  host: string;
  port: number;
  path?: string;
}