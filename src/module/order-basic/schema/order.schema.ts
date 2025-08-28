import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { OrderStatus } from "src/constant/order.constant";
import { IOrder, TOrderStatus } from "src/shared/interface/order.interface";
import { TPaymentMethod } from "src/shared/interface/payment.interface";

import { OrderItem } from "./order_product_item.schema";
import { PaymentMethod } from "src/constant/payment.constant";
import { IDelivery } from "src/shared/interface/delivery.interface";
import { Account } from "src/module/auth/schemas/account.schema";
import { OrderProductItemEntity } from "../entity/order-product-item.entity";
import { IOrderPopulated } from "src/shared/interface/order-response.interface";
import { IMongodbDocument } from "src/shared/interface/mongo.interface";
import { TLanguage } from "src/shared/interface/lang.interface";
import { Language } from "src/constant/lang.constant";

export type OrderDocument = IOrderPopulated & IMongodbDocument;

@Schema({ timestamps: true })
export class Order implements IOrder {
  @Prop({ type: String, required: true, unique: true, immutable: true })
  orderCode: string;

  @Prop({ type: Array<OrderItem>, required: true })
  orderItems: Array<OrderProductItemEntity>;

  @Prop({ type: String, required: true, default: OrderStatus.PENDING })
  status: TOrderStatus;

  @Prop({type: String})
  reasonForCancellation?: string;

  @Prop({ type: Number, required: true })
  subTotal: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: Number, required: true })
  discount: number;

  @Prop({ type: Number, required: true })
  deliveryFee: number;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: TPaymentMethod;

  @Prop({ type: Types.ObjectId, ref: Account.name })
  accountId?: Types.ObjectId | string;
  
  @Prop({
    type: String,
    enum: Language,
    required: true
  })
  lang: TLanguage;

  @Prop({ type: Object})
  delivery: IDelivery;

  @Prop({ type: String })
  note: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);