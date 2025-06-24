import { Module } from '@nestjs/common';
import { MediaLogoController } from './media-logo.controller';

@Module({
  controllers: [MediaLogoController]
})
export class MediaLogoModule {}
