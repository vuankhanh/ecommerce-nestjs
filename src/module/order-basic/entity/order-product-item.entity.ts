import { Types } from "mongoose";
import { IOrderItem } from "src/shared/interface/order.interface";

export class OrderProductItemEntity implements IOrderItem {
  _id?: Types.ObjectId;
  productId: string | Types.ObjectId;
  productThumbnail: string;
  productCode: string;
  productName: string;
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