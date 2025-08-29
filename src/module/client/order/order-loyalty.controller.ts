import { Body, Controller, DefaultValuePipe, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { IOrder } from 'src/shared/interface/order.interface';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { OrderStatus } from 'src/constant/order.constant';
import { IFooterTemplate, Template } from 'src/shared/interface/template.interface';

import { FilterQuery, Types } from 'mongoose';
import { Request } from 'express';
import { AccountIdGuard } from '../personal/guard/account_id.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { UserRole } from 'src/constant/user.constant';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { OrderCreateDto } from 'src/module/order-basic/dto/order-create.dto';
import { OrderItemEntity } from 'src/module/order-basic/entity/order-item.entity';
import { OrderItemsMapClientPipe } from 'src/shared/core/pipes/order-items-map-client.pipe';
import { OrderEntity } from 'src/module/order-basic/entity/order.entity';
import { MailService } from 'src/module/mail/mail.service';
import { Order } from 'src/module/order-basic/schema/order.schema';
import { DeliveryEntity } from '../personal/address/entity/delivery.entity';
import { Language } from 'src/constant/lang.constant';
import { AcceptLanguageValidationPipe } from 'src/shared/core/pipes/accept-language-validation/accept-language-validation.pipe';
import { TLanguage } from 'src/shared/interface/lang.interface';
import { OrderUpdateStatusDto } from 'src/shared/dto/order-update.dto';
import { OrderPlainEntity } from 'src/module/order-basic/entity/order-plain.entity';

@Controller('/client/order')
@Roles(UserRole.CLIENT)
@UseGuards(LocalAuthGuard, AccountIdGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderLoyaltyController {
  constructor(
    private configService: ConfigService,
    private readonly orderBasicService: OrderBasicService,
    private readonly mailService: MailService,
  ) { }

  @Get()
  async getAll(
    @Req() request: Request,
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Headers('accept-language') lang: TLanguage
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    filterQuery['accountId'] = new Types.ObjectId(accountId);

    return await this.orderBasicService.getAll(filterQuery, lang, page, size);
  }

  @Get('detail')
  async getDetail(
    @Req() request: Request,
    @Query('id', new ParseObjectIdPipe()) id: string,
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const filterQuery = { _id: id, accountId: new Types.ObjectId(accountId) };

    return await this.orderBasicService.getDetail(filterQuery, 'vi');
  }

  @Post()
  async create(
    @Req() request: Request,
    @Headers('accept-language') lang: Language,
    @Body() orderCreateDto: OrderCreateDto,
    @Body('orderItems', OrderItemsMapClientPipe) orderItems: Array<OrderItemEntity>
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const validatedLang: Language = new AcceptLanguageValidationPipe().transform(lang);
    const iOrder: IOrder = {
      orderItems: orderItems,
      status: OrderStatus.PENDING,
      paymentMethod: orderCreateDto.paymentMethod,
      deliveryFee: orderCreateDto.deliveryFee,
      discount: orderCreateDto.discount,
      note: orderCreateDto.note,
      delivery: orderCreateDto.delivery,
      lang: validatedLang
    }
    const order: OrderEntity = new OrderEntity(iOrder);
    order.updateAccountId = new Types.ObjectId(accountId);

    const result = await this.orderBasicService.create(order);
    try {
      const detail = await this.orderBasicService.getDetail({ _id: result._id }, 'vi');
      const orderPlainEntity: OrderPlainEntity = new OrderPlainEntity(detail, validatedLang);
      this.mailService.queueOrderReceivedEmail(orderPlainEntity);
    } catch (error) {
      console.log('Error sending email:', error);
    }

    return result;
  }

  @Put('status')
  async updateStatus(
    @Req() request: Request,
    @Headers('accept-language') lang: Language,
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body() body: OrderUpdateStatusDto,
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const validatedLang: Language = new AcceptLanguageValidationPipe().transform(lang);

    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;
    filterQuery['accountId'] = new Types.ObjectId(accountId);

    const order = await this.orderBasicService.modifyStatus(filterQuery, lang, body.status, body.reasonForCancelReason);
    if (body.status === OrderStatus.CANCELED) {
      const orderPlainEntity: OrderPlainEntity = new OrderPlainEntity(order, validatedLang);
      this.mailService.queueOrderCancelledEmail(orderPlainEntity);
    }
    return order;
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.orderBasicService.remove(filterQuery);
  }

  @Post(':id/print')
  async print(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const orderDetail = await this.orderBasicService.getDetail({ _id: id }, 'vi');
    if (![OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.COMPLETED].includes(orderDetail.status as OrderStatus)) {
      throw new CustomBadRequestException('Trạng thái của Order phải là CONFIRMED, SHIPPING, hoặc COMPLETED để in');
    }
    const order: OrderEntity = new OrderEntity(orderDetail);

    const footer: IFooterTemplate = this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(order, footer);
    return await this.orderBasicService.print(template);
  }
}
