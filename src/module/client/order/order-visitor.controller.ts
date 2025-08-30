import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import {
  IFooterTemplate,
  Template,
} from 'src/shared/interface/template.interface';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/constant/order.constant';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { IOrder } from 'src/shared/interface/order.interface';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { OrderCreateDto } from 'src/module/order-basic/dto/order-create.dto';
import { OrderItemsMapClientPipe } from 'src/shared/core/pipes/order-items-map-client.pipe';
import { OrderItemEntity } from 'src/module/order-basic/entity/order-item.entity';
import { OrderEntity } from 'src/module/order-basic/entity/order.entity';
import { AcceptLanguageValidationPipe } from 'src/shared/core/pipes/accept-language-validation/accept-language-validation.pipe';
import { Language } from 'src/constant/lang.constant';

@Controller('order')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class OrderVisitorController {
  constructor(
    private configService: ConfigService,
    private readonly orderBasicService: OrderBasicService,
  ) {}

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.orderBasicService.getAll(filterQuery, 'vi', page, size);
  }

  @Get(':id')
  async getDetail(@Param('id', new ParseObjectIdPipe()) id: string) {
    const filterQuery = { _id: id };

    return await this.orderBasicService.getDetail(filterQuery, 'vi');
  }

  @Post()
  async create(
    @Headers('accept-language') lang: Language,
    @Body() orderCreateDto: OrderCreateDto,
    @Body('orderItems', OrderItemsMapClientPipe)
    orderItems: Array<OrderItemEntity>,
  ) {
    const validatedLang: Language =
      new AcceptLanguageValidationPipe().transform(lang);
    const iOrder: IOrder = {
      orderItems: orderItems,
      status: OrderStatus.PENDING,
      paymentMethod: orderCreateDto.paymentMethod,
      deliveryFee: orderCreateDto.deliveryFee,
      discount: orderCreateDto.discount,
      note: orderCreateDto.note,
      delivery: orderCreateDto.delivery,
      lang: validatedLang,
    };
    const order: OrderEntity = new OrderEntity(iOrder);

    return await this.orderBasicService.create(order);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseObjectIdPipe()) id: string) {
    const filterQuery = { _id: id };

    return await this.orderBasicService.remove(filterQuery);
  }

  @Post(':id/print')
  async print(@Param('id', new ParseObjectIdPipe()) id: string) {
    const orderDetail = await this.orderBasicService.getDetail(
      { _id: id },
      'vi',
    );
    if (
      ![
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPING,
        OrderStatus.COMPLETED,
      ].includes(orderDetail.status as OrderStatus)
    ) {
      throw new CustomBadRequestException(
        'Trạng thái của Order phải là CONFIRMED, SHIPPING, hoặc COMPLETED để in',
      );
    }

    const footer: IFooterTemplate =
      this.configService.get<IFooterTemplate>('brand');
    const template: Template = new Template(orderDetail, footer);
    return await this.orderBasicService.print(template);
  }
}
