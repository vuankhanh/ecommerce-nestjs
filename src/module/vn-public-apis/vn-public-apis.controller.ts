import { Controller, Get, Query, UseGuards, UseInterceptors, } from '@nestjs/common';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';

import { VnPublicApisService } from './vn-public-apis.service';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';

@Controller('vn-public-apis')
@UseInterceptors(FormatResponseInterceptor)
export class VnPublicApisController {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    // private readonly supplierService: SupplierService,
    private readonly vnPublicApisService: VnPublicApisService
  ) { }

  @Get('provinces')
  async getProvinces() {
    return await this.vnPublicApisService.getProvinces();
  }

  @Get('districts')
  async getDistricts(
    @Query('provinceCode') provinceCode: string
  ) {
    if (!provinceCode) {
      throw new CustomBadRequestException('phải có provinceCode');
    }
    try {
      return await this.vnPublicApisService.getDistricts(provinceCode);
    } catch (error) {
      this.customLoggerService.error(error.message, error.stack);
    }
  }

  @Get('wards')
  async getWards(
    @Query('districtCode') districtCode: string
  ) {
    if (!districtCode) {
      throw new CustomBadRequestException('phải có districtCode');
    }
    try {
      return await this.vnPublicApisService.getWards(districtCode);
    } catch (error) {
      this.customLoggerService.error(error.message, error.stack);
    }
  }
}
