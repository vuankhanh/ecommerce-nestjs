import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { IOrderItem } from "src/shared/interface/order.interface";

@Schema({ timestamps: true })
export class OrderItem implements IOrderItem {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId()
  })
  _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  productThumbnail: string;

  @Prop({ type: String, required: true })
  productCode: string;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: String, required: true })
  productCategorySlug: string;

  @Prop({ type: String, required: true })
  productSlug: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;

  constructor(orderItem: IOrderItem) {
    this._id = new Types.ObjectId();
    this.productThumbnail = orderItem.productThumbnail;
    this.productCode = orderItem.productCode;
    this.productName = orderItem.productName;
    this.productCategorySlug = orderItem.productCategorySlug;
    this.productSlug = orderItem.productSlug;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.total = this.price * this.quantity;
  }
}