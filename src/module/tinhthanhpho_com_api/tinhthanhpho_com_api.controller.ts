import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import {
  CustomBadRequestException,
  CustomInternalServerErrorException,
} from 'src/shared/core/exception/custom-exception';

import { TinhthanhphoComApiService } from './tinhthanhpho_com_api.service';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';

@Controller('tinhthanhpho-com-api/v1')
@UseInterceptors(FormatResponseInterceptor)
export class TinhthanhphoComApiController {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    // private readonly supplierService: SupplierService,
    private readonly tinhthanhphoComApiService: TinhthanhphoComApiService,
  ) {}

  @Get('provinces')
  async getProvinces(
    @Query('keyword') keyword: string = '',
    @Query('size') sizeParam: number = 20,
    @Query('page') pageParam: number = 1,
  ) {
    try {
      const response = await this.tinhthanhphoComApiService.getProvinces(
        keyword,
        sizeParam,
        pageParam,
      );

      if (!response.success)
        throw new CustomInternalServerErrorException(
          'Lỗi từ tinhthanhpho.com api',
        );
      const data = response.data;
      const totalItems = response.metadata.total;
      const size = response.metadata.limit;
      const page = response.metadata.page;
      const totalPages = Math.ceil(totalItems / size);
      return {
        data,
        paging: {
          totalItems,
          size,
          page,
          totalPages,
        },
      };
    } catch (error) {
      console.log(error);

      throw new CustomInternalServerErrorException(error.message);
    }
  }

  @Get('districts')
  async getDistricts(
    @Query('provinceCode') provinceCode: string,
    @Query('keyword') keyword: string = '',
    @Query('size') sizeParam: number = 20,
    @Query('page') pageParam: number = 1,
  ) {
    if (!provinceCode) {
      throw new CustomBadRequestException('phải có provinceCode');
    }
    try {
      const response = await this.tinhthanhphoComApiService.getDistricts(
        provinceCode,
        keyword,
        sizeParam,
        pageParam,
      );
      if (!response.success)
        throw new CustomInternalServerErrorException(
          'Lỗi từ tinhthanhpho.com api',
        );
      const data = response.data;
      const totalItems = response.metadata.total;
      const size = response.metadata.limit;
      const page = response.metadata.page;
      const totalPages = Math.ceil(totalItems / size);
      return {
        data,
        paging: {
          totalItems,
          size,
          page,
          totalPages,
        },
      };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message);
    }
  }

  @Get('wards')
  async getWards(
    @Query('districtCode') districtCode: string,
    @Query('keyword') keyword: string = '',
    @Query('size') sizeParam: number = 20,
    @Query('page') pageParam: number = 1,
  ) {
    if (!districtCode) {
      throw new CustomBadRequestException('phải có districtCode');
    }
    try {
      const response = await this.tinhthanhphoComApiService.getWards(
        districtCode,
        keyword,
        sizeParam,
        pageParam,
      );
      if (!response.success)
        throw new CustomInternalServerErrorException(
          'Lỗi từ tinhthanhpho.com api',
        );
      const data = response.data;
      const totalItems = response.metadata.total;
      const size = response.metadata.limit;
      const page = response.metadata.page;
      const totalPages = Math.ceil(totalItems / size);
      return {
        data,
        paging: {
          totalItems,
          size,
          page,
          totalPages,
        },
      };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message);
    }
  }
}
