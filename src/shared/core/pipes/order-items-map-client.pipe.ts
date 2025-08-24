import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { ProductService } from 'src/module/client/product/product.service';
import { IOrderItemsRequest } from 'src/shared/interface/order-request.interface';
import { CustomBadRequestException } from '../exception/custom-exception';
import { OrderProductItemEntity } from 'src/module/order-basic/entity/order-product-item.entity';
import { Types } from 'mongoose';
import { Request } from 'express';

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

    const lang = this.request.query.lang ? String(this.request.query.lang) : 'vi';
    const mappedOrderItems: Array<OrderProductItemEntity> = [];

    for (const orderItemRequest of orderItemsRequest) {
      if (!orderItemRequest.productId) throw new CustomBadRequestException('Thiếu productId');
      const product = await this.productService.getDetail({ _id: new Types.ObjectId(orderItemRequest.productId) }, lang);
      if (!product) throw new CustomBadRequestException(`Sản phẩm với ID ${orderItemRequest.productId} không tồn tại`);

      const orderItem: OrderProductItemEntity = new OrderProductItemEntity({
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
