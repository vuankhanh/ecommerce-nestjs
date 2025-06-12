import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VnPublicApisController } from './vn-public-apis.controller';
import { VnPublicApisService } from './vn-public-apis.service';
import { CustomLoggerModule } from '../custom_logger/custom_logger.module';

@Module({
  imports: [
    CustomLoggerModule
  ],
  providers: [
    ConfigService,
    VnPublicApisService
  ],
  exports: [VnPublicApisService],
  controllers: [VnPublicApisController],
})
export class VnPublicApisModule {}
