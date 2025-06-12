import { Prop, Schema } from "@nestjs/mongoose";
import { IOrderItem } from "src/shared/interface/order.interface";
import { OrderUtil } from "src/shared/util/order.util";

@Schema({ timestamps: true })
export class OrderItem implements IOrderItem {
  @Prop({ type: String, required: true })
  productThumbnail: string;
  
  @Prop({ type: String, required: true })
  productCode: string;

  @Prop({ type: String, required: true })
  productName: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;

  constructor(orderItem: IOrderItem) {
    this.productThumbnail = orderItem.productThumbnail;
    this.productCode = orderItem.productCode;
    this.productName = orderItem.productName;
    this.quantity = orderItem.quantity;
    this.unit = orderItem.unit;
    this.price = orderItem.price;
    this.total = this.price * this.quantity;
  }
}