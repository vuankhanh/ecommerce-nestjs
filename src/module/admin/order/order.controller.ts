import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { OrderUpdateDto, OrderUpdateStatusDto } from 'src/shared/dto/order-update.dto';
import { OrderItemsMapAdminPipe } from 'src/shared/core/pipes/order-items-map-admin.pipe';
import { OrderUtil } from 'src/shared/util/order.util';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { AddressUtil } from 'src/shared/util/address.util';
import { MailService } from 'src/module/mail/mail.service';
import { TLanguage } from 'src/shared/interface/lang.interface';
import { OrderPlainEntity } from 'src/module/order-basic/entity/order-plain.entity';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderController {
  constructor(
    private readonly orderBasicService: OrderBasicService,
    private readonly orderItemsMapAdminPipe: OrderItemsMapAdminPipe,
    private readonly mailService: MailService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Body() body: FilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const lang: TLanguage = 'vi';
    const filterQuery: FilterQuery<Order> = {};

    if (body) {
      if (body.fromDate || body.toDate) {
        filterQuery.createdAt = {};
        if (body.fromDate) filterQuery.createdAt.$gte = new Date(body.fromDate);
        if (body.toDate) filterQuery.createdAt.$lte = new Date(body.toDate);
      }
      if (body.statuses && body.statuses.length) {
        filterQuery.status = {};
        filterQuery.status.$in = body.statuses;
      }
    }

    return await this.orderBasicService.getAll(filterQuery, lang, page, size);
  }

  @Get('detail')
  getDetail(
    @Query('id', new ParseObjectIdPipe()) id: string,
  ) {
    const lang: TLanguage = 'vi';
    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;

    return this.orderBasicService.getDetail(filterQuery, lang);
  }

  @Put('status')
  async updateStatus(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body() body: OrderUpdateStatusDto,
  ) {
    const lang: TLanguage = 'vi';
    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;

    const order = await this.orderBasicService.modifyStatus(filterQuery, lang, body.status, body.reasonForCancelReason);
    if (body.status === OrderStatus.CANCELED) {
      const lang: TLanguage = order.lang || 'vi';
      const orderPlainEntity: OrderPlainEntity = new OrderPlainEntity(order, lang);
      this.mailService.queueOrderCancelledEmail(orderPlainEntity);
    }
    return order;
  }

  @Put()
  async update(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body() body: OrderUpdateDto,
  ) {
    const lang: TLanguage = 'vi';
    const filterQuery: FilterQuery<Order> = {};
    if (id) filterQuery['_id'] = id;

    const oldOrder = await this.orderBasicService.getDetail(filterQuery, lang);
    if (!oldOrder) throw new CustomBadRequestException('Đơn hàng không tồn tại');

    if (oldOrder.status != OrderStatus.PENDING) {
      throw new CustomBadRequestException('Không thể sửa đơn hàng ở trạn thái hiện tại');
    }

    const oldOrderLang: TLanguage = oldOrder.lang || lang;

    // Khởi tạo đối tượng orderUpdate
    // Đây là đối tượng sẽ chứa các trường cần cập nhật.
    const orderUpdate: Partial<Order> = {};

    // Khởi tạo đối tượng orderUpdateForEmail
    // Đây là đối tượng sẽ chứa các trường cần gửi qua email.
    // Sử dụng Partial để chỉ định rằng đây là một phần của Order, không cần đầy đủ tất cả các trường.
    const orderUpdateForEmail: Partial<OrderPlainEntity> = {};

    //Kiểm tra nếu tồn tại các yếu tố ảnh hưởng đến tổng tiền. orderItems, deliveryFee, discount
    if (body.orderItems || body.deliveryFee || body.discount) {
      orderUpdateForEmail.subTotal = oldOrder.subTotal;
      orderUpdateForEmail.deliveryFee = oldOrder.deliveryFee || 0;
      orderUpdateForEmail.discount = oldOrder.discount || 0;

      // Nếu có orderItems, sử dụng pipe để chuyển đổi
      // Thêm orderItems vào orderUpdate nếu có
      // Tính subTotal từ orderItems và gán lại cho subTotal cũ
      if (body.orderItems) {
        // Gọi pipe transform thủ công
        orderUpdate.orderItems = await this.orderItemsMapAdminPipe.transform(body.orderItems);
        orderUpdateForEmail.orderItems = OrderPlainEntity.getOrderItemsPlain(orderUpdate.orderItems, lang);
        const subTotal = OrderUtil.calculateSubTotal(orderUpdate.orderItems);
        orderUpdate.subTotal = subTotal;
        orderUpdateForEmail.subTotal = subTotal;
      }

      // Nếu có deliveryFee
      // Thêm deliveryFee vào orderUpdate nếu có
      // Gán lại oldOrderDeliveryFee nếu có
      if (body.deliveryFee) {
        orderUpdate.deliveryFee = body.deliveryFee;
        orderUpdateForEmail.deliveryFee = body.deliveryFee;
      }

      // Nếu có discount
      // Thêm vào orderUpdate
      // Gán lại oldOrderDiscount nếu có
      if (body.discount) {
        orderUpdate.discount = body.discount;
        orderUpdateForEmail.discount = body.discount;
      }

      // Tính tổng tiền mới
      // Gọi hàm tính tổng tiền từ OrderUtil
      // Gán lại tổng tiền vào orderUpdate
      const total = OrderUtil.calculateTotal(orderUpdateForEmail.subTotal, orderUpdateForEmail.deliveryFee, orderUpdateForEmail.discount);
      orderUpdate.total = total;
      orderUpdateForEmail.total = total;
    }
    if (body.paymentMethod) {
      orderUpdate.paymentMethod = body.paymentMethod;
      orderUpdateForEmail.paymentMethod = OrderPlainEntity.getPaymentMethodPlain(body.paymentMethod, oldOrderLang);
    }
    if (body.delivery) {
      orderUpdate.delivery = body.delivery;
      orderUpdateForEmail.delivery = body.delivery;
      orderUpdateForEmail.delivery['addressDetail'] = AddressUtil.addressDetail(body.delivery);
    }

    const order = await this.orderBasicService.updateOrder(filterQuery, lang, orderUpdate);
    const orderPlainEntity: OrderPlainEntity = new OrderPlainEntity(oldOrder, oldOrderLang);
    this.mailService.queueOrderChangedEmail(orderPlainEntity, orderUpdateForEmail);
    return order;
  }
}
