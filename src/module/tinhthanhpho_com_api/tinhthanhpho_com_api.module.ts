import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TinhthanhphoComApiController } from './tinhthanhpho_com_api.controller';
import { TinhthanhphoComApiService } from './tinhthanhpho_com_api.service';
import { CustomLoggerModule } from '../custom_logger/custom_logger.module';

@Module({
  imports: [
    CustomLoggerModule
  ],
  providers: [
    ConfigService,
    TinhthanhphoComApiService
  ],
  exports: [TinhthanhphoComApiService],
  controllers: [TinhthanhphoComApiController],
})
export class TinhthanhphoComApiModule {}
