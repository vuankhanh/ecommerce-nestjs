import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { ProductService } from 'src/module/client/product/product.service';
import { IOrderItemsRequest } from 'src/shared/interface/order-request.interface';
import { CustomBadRequestException } from '../exception/custom-exception';
import { OrderItemEntity } from 'src/module/order-basic/entity/order-item.entity';
import { Types } from 'mongoose';
import { Request } from 'express';
import { TLanguage } from 'src/shared/interface/lang.interface';

@Injectable({
  scope: Scope.REQUEST
})
export class OrderItemsMapClientPipe implements PipeTransform {
  constructor(
    private readonly productService: ProductService,
    @Inject('REQUEST') private readonly request: Request
  ) { }

  async transform(orderItemsRequest: IOrderItemsRequest[]) {
    if (!orderItemsRequest || !Array.isArray(orderItemsRequest)) {
      throw new CustomBadRequestException('orderItems không hợp lệ');
    }

    const lang: TLanguage = this.request.query.lang ? this.request.query.lang as TLanguage : 'vi';
    const mappedOrderItems: Array<OrderItemEntity> = [];

    for (const orderItemRequest of orderItemsRequest) {
      if (!orderItemRequest.productId) throw new CustomBadRequestException('Thiếu productId');
      const product = await this.productService.getRawData({ _id: new Types.ObjectId(orderItemRequest.productId) });
      if (!product) throw new CustomBadRequestException(`Sản phẩm với ID ${orderItemRequest.productId} không tồn tại`);

      const orderItem: OrderItemEntity = new OrderItemEntity({
        productId: orderItemRequest.productId,
        productThumbnail: product.album?.thumbnailUrl || '',
        productCode: product.code,
        productName: product.name,
        productCategorySlug: product.productCategory?.slug || '',
        productSlug: product.slug,
        quantity: orderItemRequest.quantity,
        price: product.price,
      });
      mappedOrderItems.push(orderItem);
    }

    return mappedOrderItems;
  }
}
