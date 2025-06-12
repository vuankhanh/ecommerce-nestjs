import { Module } from '@nestjs/common';
import { ServerConfigController } from './server-config.controller';

@Module({
  controllers: [ServerConfigController]
})
export class ServerConfigModule {}
