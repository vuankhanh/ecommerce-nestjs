import { Controller, Get } from '@nestjs/common';

@Controller('config')
export class ServerConfigController {
  @Get()
  getConfig() {
    return {
      appName: 'My Application',
      version: '1.0.0',
      description: 'This is a sample application configuration endpoint.',
    };
  }
}
