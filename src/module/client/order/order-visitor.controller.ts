import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { ObjectId } from 'mongodb';
import { IFooterTemplate, Template } from 'src/shared/interface/template.interface';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/constant/status.constant';
import { OrderUtil } from 'src/shared/util/order.util';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { IOrder, IOrderItem } from 'src/shared/interface/order.interface';
import { ProductService } from '../product/product.service';
import { ProductDocument } from 'src/shared/schema/product.schema';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { OrderCreateDto } from 'src/module/order-basic/dto/order-create.dto';
import { Order } from 'src/module/order-basic/schema/order.schema';

@Controller('order')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderVisitorController {
  constructor(
    private configService: ConfigService,
    private readonly orderBasicService: OrderBasicService,
    private readonly productService: ProductService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.orderBasicService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.orderBasicService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() orderCreateDto: OrderCreateDto
  ) {
    console.log(orderCreateDto);
    const orderItems: IOrderItem[] = [];
    for (const item of orderCreateDto.orderItems) {
      const productId = ObjectId.createFromHexString(item.productId);
      const product: ProductDocument = await this.productService.getDetail({ _id: productId })
      if (!product) {
        throw new CustomBadRequestException(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }

      const orderItem: IOrderItem = {
        productThumbnail: product?.album?.thumbnailUrl,
        productCode: product.code,
        productName: product.name,
        productCategorySlug: product.productCategory?.slug,
        productSlug: product.slug,
        quantity: item.quantity,
        price: product.price
      };

      orderItems.push(orderItem);
    }

    const iOrder : IOrder = {
      orderItems: orderItems,
      status: OrderStatus.PENDING,
      paymentMethod: orderCreateDto.paymentMethod,
      deliveryFee: orderCreateDto.deliveryFee,
      discount: orderCreateDto.discount,
      note: orderCreateDto.note,
      delivery: orderCreateDto.delivery,
    }
    const order: Order = new Order(iOrder);
    console.log(order.orderItems);
    
    return await this.orderBasicService.create(order);
  }

  // @Put(':id')
  // async replace(
  //   @Param('id', new ParseObjectIdPipe()) id: string,
  //   @Body() orderDto: OrderDto
  // ) {
  //   const filterQuery = { _id: id };
  //   const order = new Order(orderDto);
  //   order.updateCustomerId = orderDto.customerId;

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

  //   if (orderDto.customerId) data.customerId = ObjectId.createFromHexString(orderDto.customerId);

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
    const orderDetail = await this.orderBasicService.getDetail({ _id: id });
    if (![OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.COMPLETED].includes(orderDetail.status as OrderStatus)) {
      throw new CustomBadRequestException('Trạng thái của Order phải là CONFIRMED, SHIPPING, hoặc COMPLETED để in');
    }
    const order: Order = new Order(orderDetail);

    const footer: IFooterTemplate = this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(order, footer);
    return await this.orderBasicService.print(template);
  }
}