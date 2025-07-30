import { Body, Controller, DefaultValuePipe, Get, HttpCode, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRole } from 'src/constant/user.constant';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { FilterDto } from './dto/filter.dto';
import { FilterQuery } from 'mongoose';
import { Order } from 'src/module/order-basic/schema/order.schema';
import { OrderStatus } from 'src/constant/order.constant';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { OrderUpdateDto } from './dto/order-update.dto';
import { OrderItemsMapAdminPipe } from 'src/shared/core/pipes/order-items-map-admin.pipe';
import { IOrderItemsRequest } from 'src/shared/interface/order-request.interface';
import { OrderProductItemEntity } from 'src/module/order-basic/entity/order-product-item.entity';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderController {
  constructor(
    private readonly orderBasicService: OrderBasicService,
    private readonly orderItemsMapAdminPipe: OrderItemsMapAdminPipe
  ) { }
  
  @Post()
  @HttpCode(200)
  async getAll(
    @Body() body: FilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery: FilterQuery<Order> = {};
    filterQuery.status = { $ne: OrderStatus.CANCELED };

    if(body){
      if (body.fromDate || body.toDate) {
        filterQuery.createdAt = {};
        if (body.fromDate) filterQuery.createdAt.$gte = new Date(body.fromDate);
        if (body.toDate) filterQuery.createdAt.$lte = new Date(body.toDate);
      }
      if (body.statuses && body.statuses.length) filterQuery.status.$in = body.statuses ;
    }
    
    return await this.orderBasicService.getAll(filterQuery, page, size);
  }

  @Get('detail')
  getDetail(
    @Query('id', new ParseObjectIdPipe()) id?: string,
  ) {
    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;

    return this.orderBasicService.getDetail(filterQuery);
  }

  @Put()
  async update(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body() body: OrderUpdateDto,
  ) {
    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;
    const orderUpdate: Partial<Order> = {};
    if (body.status) orderUpdate.status = body.status;
    if (body.orderItems) {
      // Gọi pipe transform thủ công
      orderUpdate.orderItems = await this.orderItemsMapAdminPipe.transform(body.orderItems);
    }
    if (body.paymentMethod) orderUpdate.paymentMethod = body.paymentMethod;
    if (body.deliveryFee) orderUpdate.deliveryFee = body.deliveryFee;
    if (body.discount) orderUpdate.discount = body.discount;
    if (body.delivery) orderUpdate.delivery = body.delivery;

    return await this.orderBasicService.modify(filterQuery, orderUpdate);
  }
}
