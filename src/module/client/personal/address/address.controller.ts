import { Body, Controller, DefaultValuePipe, Delete, Get, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRole } from 'src/constant/user.constant';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { DeliveryInfoDto, UpdateDeliveryInfoDto } from 'src/shared/dto/delivery.dto';
import { AccountIdGuard } from '../guard/account_id.guard';
import { Request } from 'express';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { AddressService } from './address.service';
import { Delivery } from './schema/delivery.schema';
import { Types } from "mongoose";
import { DeliveryEntity } from './entity/delivery.entity';
@Controller()
@Roles(UserRole.CLIENT)
@UseGuards(LocalAuthGuard, AccountIdGuard)
@UseInterceptors(FormatResponseInterceptor)
export class AddressController {

  constructor(
    private readonly addressService: AddressService
  ) { }

  @Get()
  @UseGuards()
  async getAddress(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const filterQuery = { accountId: new Types.ObjectId(accountId) };
    return await this.addressService.getAll(filterQuery, 'vi', page, size);
  }

  @Get('detail')
  async getAddressDetail(
    @Req() request: Request,
    @Query('deliveryId') deliveryId: string
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    if (!deliveryId) {
      throw new CustomBadRequestException('Delivery ID là bắt buộc');
    }

    const filterQuery = { _id: new Types.ObjectId(deliveryId), accountId: new Types.ObjectId(accountId) };

    return this.addressService.getDetail(filterQuery, 'vi');
  }

  @Get('default')
  async getDefaultAddress(
    @Req() request: Request
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const filterQuery = { 
      accountId: new Types.ObjectId(accountId), 
      isDefault: true 
    };
    
    return this.addressService.getDetail(filterQuery, 'vi');
  }

  @Post()
  createAddress(
    @Req() request: Request,
    @Body() deliveryInfoDto: DeliveryInfoDto  // Replace 'any' with the actual DTO type for address
  ) {
    const accountId = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }
    const delivery: DeliveryEntity = new DeliveryEntity(accountId, deliveryInfoDto.name, deliveryInfoDto.phoneNumber, deliveryInfoDto.address);
    return this.addressService.create(delivery.toPlainObject());
  }

  @Patch()
  async updateAddress(
    @Req() request: Request,
    @Body() updateDeliveryInfo: UpdateDeliveryInfoDto,
    @Query('deliveryId') deliveryId: string
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    if (!deliveryId) {
      throw new CustomBadRequestException('Delivery ID là bắt buộc');
    }

    const partialDelivery: Partial<Delivery> = {...updateDeliveryInfo}

    if(updateDeliveryInfo.address){

      partialDelivery.addressDetail = DeliveryEntity.generateAddressDetail(updateDeliveryInfo.address);
    }

    const filterQuery = { _id: new Types.ObjectId(deliveryId), accountId: new Types.ObjectId(accountId) };
    return this.addressService.modify(filterQuery, partialDelivery);
  }

  @Patch('set-default')
  async setDefaultAddress(
    @Req() request: Request,
    @Query('deliveryId') deliveryId: string
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    if (!deliveryId) {
      throw new CustomBadRequestException('Delivery ID là bắt buộc');
    }

    return this.addressService.setDefaultAddress(accountId, deliveryId);
  }

  @Delete()
  async deleteAddress(
    @Req() request: Request,
    @Query('deliveryId') deliveryId: string
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    if (!deliveryId) {
      throw new CustomBadRequestException('Delivery ID là bắt buộc');
    }

    const filterQuery = { _id: new Types.ObjectId(deliveryId), accountId: new Types.ObjectId(accountId) };
    return await this.addressService.remove(filterQuery);
  }
}
