import { Types } from 'mongoose';
import { TLanguage } from 'src/shared/interface/lang.interface';
import { IOrderItem } from 'src/shared/interface/order.interface';

export class OrderItemEntity implements IOrderItem {
  _id: Types.ObjectId | string;
  productId: string | Types.ObjectId;
  productThumbnail: string;
  productCode: string;
  productName: { [key in TLanguage]: string };
  productCategorySlug: string;
  productSlug: string;
  quantity: number;
  price: number;
  total: number;

  constructor(orderItem: IOrderItem) {
    this._id = new Types.ObjectId();
    this.productId = orderItem.productId;
    this.productThumbnail = orderItem.productThumbnail;
    this.productCode = orderItem.productCode;
    this.productName = orderItem.productName;
    this.productCategorySlug = orderItem.productCategorySlug;
    this.productSlug = orderItem.productSlug;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.total = this.quantity * this.price;
  }
}
