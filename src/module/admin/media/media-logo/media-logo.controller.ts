import { Controller, Get } from '@nestjs/common';

@Controller()
export class MediaLogoController {
  @Get()
  getMediaLogo() {
    return 'Media Logo Endpoint';
  }
}
