import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongodbProvider implements MongooseOptionsFactory {
  constructor(
    private configService: ConfigService
  ) { }

  createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
    const host = this.configService.get<number>('db.host');
    const port = this.configService.get<number>('db.port');
    const path = this.configService.get<string>('db.path');
    const uri = `mongodb://${host}:${port}/${path}`;
    return {
      uri,
    };
  }
}
