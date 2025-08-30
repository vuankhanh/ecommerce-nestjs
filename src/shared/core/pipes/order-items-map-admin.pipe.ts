import { Injectable, PipeTransform } from '@nestjs/common';
import { CustomBadRequestException } from '../exception/custom-exception';
import { ProductService } from 'src/module/admin/product/product.service';
import { Types } from 'mongoose';
import { IOrderItemsRequest } from 'src/shared/interface/order-request.interface';
import { OrderItemEntity } from 'src/module/order-basic/entity/order-item.entity';

@Injectable()
export class OrderItemsMapAdminPipe implements PipeTransform {
  constructor(private readonly productService: ProductService) {}

  async transform(
    orderItemsRequest: IOrderItemsRequest[],
  ): Promise<OrderItemEntity[]> {
    if (!orderItemsRequest || !Array.isArray(orderItemsRequest)) {
      throw new CustomBadRequestException('orderItems không hợp lệ');
    }

    const mappedOrderItems: Array<OrderItemEntity> = [];

    for (const orderItemRequest of orderItemsRequest) {
      if (!orderItemRequest.productId)
        throw new CustomBadRequestException('Thiếu productId');
      const product = await this.productService.getDetail({
        _id: new Types.ObjectId(orderItemRequest.productId),
      });
      if (!product)
        throw new CustomBadRequestException(
          `Sản phẩm với ID ${orderItemRequest.productId} không tồn tại`,
        );

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
