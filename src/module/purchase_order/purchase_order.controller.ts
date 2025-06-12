import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/purchase_order.dto';
import { PurchaseOrderService } from './purchase_order.service';
import { PurchaseOrderItem } from './schema/purchase_order_item.schema';
import { Purchase_Order } from './schema/purchase_order.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('purchase-order')
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor, )
export class PurchaseOrderController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.purchaseOrderService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.purchaseOrderService.getDetail(filterQuery);
  }

  @Post()
  async createPurchaseOrder(
    @Body() purchaseOrderDto: PurchaseOrderDto
  ) {
    const purchaseOrderItem = purchaseOrderDto.purchaseOrderItems.map(item => {
      const purchaseOrderItem: PurchaseOrderItem = new PurchaseOrderItem(item);
      return purchaseOrderItem;
    });

    const purchaseOrder: Purchase_Order = new Purchase_Order(
      purchaseOrderDto.status,
      purchaseOrderItem
    );

    // this.purchaseOrderService.create(purchaseOrderDto);
    // Logic to create a purchase order
    return await this.purchaseOrderService.create(purchaseOrder);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto
  ) {
    const filterQuery = { _id: id };

    const data: Partial<Purchase_Order> = {};

    if (updatePurchaseOrderDto.status) data.status = updatePurchaseOrderDto.status;
    if(updatePurchaseOrderDto.purchaseOrderItems) {
      const purchaseOrderItem: PurchaseOrderItem[] = updatePurchaseOrderDto.purchaseOrderItems.map(item => {
        const purchaseOrderItem: PurchaseOrderItem = new PurchaseOrderItem(item);
        return purchaseOrderItem;
      });

      data.purchaseOrderItems = purchaseOrderItem;
    }

    // this.purchaseOrderService.create(purchaseOrderDto);
    // Logic to create a purchase order
    return await this.purchaseOrderService.modify(filterQuery, data);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() purchaseOrderDto: PurchaseOrderDto
  ) {
    const filterQuery = { _id: id };
    const purchaseOrderItem = purchaseOrderDto.purchaseOrderItems.map(item => {
      const purchaseOrderItem: PurchaseOrderItem = new PurchaseOrderItem(item);
      return purchaseOrderItem;
    });

    const purchaseOrder: Purchase_Order = new Purchase_Order(
      purchaseOrderDto.status,
      purchaseOrderItem
    );

    // this.purchaseOrderService.create(purchaseOrderDto);
    // Logic to create a purchase order
    return await this.purchaseOrderService.replace(filterQuery, purchaseOrder);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.purchaseOrderService.remove(filterQuery);
  }
}
