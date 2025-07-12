import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRole } from 'src/constant/user.constant';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { DeliveryInfoDto } from 'src/shared/dto/delivery.dto';
import { AccountIdGuard } from '../guard/account_id.guard';
import { Request } from 'express';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { AddressService } from './address.service';

@Controller()
@Roles(UserRole.CLIENT)
@UseGuards(LocalAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) { }

  @Get()
  @UseGuards(AccountIdGuard)
  async getAddress(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const accountId = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const filterQuery = { accountId };
    return await this.addressService.getAll(filterQuery, page, size);
  }

  @Post()
  @UseGuards(AccountIdGuard)
  createAddress(
    @Req() request: Request,
    @Body() deliveryInfoDto: DeliveryInfoDto  // Replace 'any' with the actual DTO type for address
  ) {
    const accountId = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    // Here you would typically call a service to handle the creation of the address
    // For example:
    // return this.addressService.createAddress(accountId, deliveryInfoDto);

    return {
      message: 'Address created successfully',
      accountId,
      deliveryInfo: deliveryInfoDto,
    };
  }
}
