import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { IUrl } from 'src/shared/interface/configuration.interface';

@Injectable()
export class BullConfigProvider implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration(): BullModuleOptions {
    const url: IUrl = this.configService.get<IUrl>('redis');
    return {
      redis: {
        host: url.host,
        port: url.port,
      },
    };
  }
}
