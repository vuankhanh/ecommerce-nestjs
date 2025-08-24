import { Body, Controller, DefaultValuePipe, Delete, Get, Headers, Param, ParseIntPipe, Post, Query, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ProductService } from '../product/product.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { IOrder } from 'src/shared/interface/order.interface';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { OrderStatus } from 'src/constant/order.constant';
import { IFooterTemplate, Template } from 'src/shared/interface/template.interface';

import { Types } from 'mongoose';
import { Request } from 'express';
import { AccountIdGuard } from '../personal/guard/account_id.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { UserRole } from 'src/constant/user.constant';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { OrderCreateDto } from 'src/module/order-basic/dto/order-create.dto';
import { OrderProductItemEntity } from 'src/module/order-basic/entity/order-product-item.entity';
import { OrderItemsMapClientPipe } from 'src/shared/core/pipes/order-items-map-client.pipe';
import { OrderEntity } from 'src/module/order-basic/entity/order.entity';
import { MailService } from 'src/module/mail/mail.service';
import { AccountDocument } from 'src/module/auth/schemas/account.schema';
import { OrderDocument } from 'src/module/order-basic/schema/order.schema';
import { DeliveryEntity } from '../personal/address/entity/delivery.entity';

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
    @Headers('accept-language') lang: string
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
    @Body() orderCreateDto: OrderCreateDto,
    @Body('orderItems', OrderItemsMapClientPipe) orderItems: Array<OrderProductItemEntity>
  ) {
    const accountId: string = request['customParams'].accountId;
    if (!accountId) {
      throw new CustomBadRequestException('Không tìm thấy thông tin tài khoản');
    }

    const iOrder: IOrder = {
      orderItems: orderItems,
      status: OrderStatus.PENDING,
      paymentMethod: orderCreateDto.paymentMethod,
      deliveryFee: orderCreateDto.deliveryFee,
      discount: orderCreateDto.discount,
      note: orderCreateDto.note,
      delivery: orderCreateDto.delivery,
    }
    const order: OrderEntity = new OrderEntity(iOrder);
    order.updateAccountId = new Types.ObjectId(accountId);

    const result = await this.orderBasicService.create(order);
    try {
      const detail = await this.orderBasicService.getDetail({ _id: result._id }, 'vi');
      
      detail.delivery['addressDetail'] = DeliveryEntity.generateAddressDetail(detail.delivery.address);
      this.mailService.queueOrderReceivedEmail(detail);
    } catch (error) {
      console.log('Error sending email:', error);
    }

    return result;
  }

  // @Put(':id')
  // async replace(
  //   @Param('id', new ParseObjectIdPipe()) id: string,
  //   @Body() orderDto: OrderDto
  // ) {
  //   const filterQuery = { _id: id };
  //   const order = new Order(orderDto);
  //   order.updateaccountd = orderDto.accountd;

  //   return await this.orderService.replace(filterQuery, order);
  // }

  // @Patch(':id')
  // async modify(
  //   @Param('id', new ParseObjectIdPipe()) id: string,
  //   @Body() orderDto: UpdateOrderDto
  // ) {
  //   const filterQuery = { _id: id };

  //   const data: UpdateOrderDto = orderDto;
  //   // Lấy đơn hàng hiện tại từ cơ sở dữ liệu
  //   const currentOrder = await this.orderService.findById(id);

  //   // Cập nhật các thuộc tính thay đổi
  //   if (orderDto.orderItems) currentOrder.orderItems = OrderUtil.transformOrderItems(orderDto.orderItems);
  //   if (orderDto.deliveryFee !== undefined) currentOrder.deliveryFee = orderDto.deliveryFee;
  //   if (orderDto.discount !== undefined) currentOrder.discount = orderDto.discount;

  //   // Tính lại tổng số nếu các thuộc tính liên quan thay đổi
  //   if (orderDto.orderItems || orderDto.deliveryFee !== undefined || orderDto.discount !== undefined) {
  //     const subTotal = OrderUtil.calculateSubTotal(currentOrder.orderItems);
  //     data.total = OrderUtil.calculateTotal(subTotal, currentOrder.deliveryFee, currentOrder.discount);
  //   }

  //   if (orderDto.accountd) data.accountId = ObjectId.createFromHexString(orderDto.accountd);

  //   if (orderDto.customerName) {
  //     data.customerName = orderDto.customerName;
  //   }

  //   if (orderDto.customerAddress) {
  //     data.customerAddress = orderDto.customerAddress;
  //   }

  //   if (orderDto.customerPhoneNumber) {
  //     data.customerPhoneNumber = orderDto.customerPhoneNumber;
  //   }

  //   return await this.orderService.modify(filterQuery, data);
  // }

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
