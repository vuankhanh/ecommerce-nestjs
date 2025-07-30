import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CustomBadRequestException } from '../exception/custom-exception';
import { ProductService } from 'src/module/admin/product/product.service';
import { Types } from 'mongoose';
import { IOrderItemsRequest } from 'src/shared/interface/order-request.interface';
import { OrderProductItemEntity } from 'src/module/order-basic/entity/order-product-item.entity';

@Injectable()
export class OrderItemsMapAdminPipe implements PipeTransform {
  constructor(private readonly productService: ProductService) {}

  async transform(orderItemsRequest: IOrderItemsRequest[]): Promise<OrderProductItemEntity[]> {
    if (!orderItemsRequest || !Array.isArray(orderItemsRequest)) {
      throw new CustomBadRequestException('orderItems không hợp lệ');
    }

    const mappedOrderItems: Array<OrderProductItemEntity> = [];

    for (const orderItemRequest of orderItemsRequest) {
      if (!orderItemRequest.productId) throw new CustomBadRequestException('Thiếu productId');
      const product = await this.productService.getDetail({ _id: new Types.ObjectId(orderItemRequest.productId) });
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
