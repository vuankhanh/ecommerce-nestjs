import { Types } from "mongoose";
import { IDelivery } from "src/shared/interface/delivery.interface";
import { Order } from "../schema/order.schema";
import { OrderProductItemEntity } from "./order-product-item.entity";
import { TLanguage } from "src/shared/interface/lang.interface";

export class OrderTranslateEntity implements Order {
  orderCode: string;
  orderItems: OrderProductItemEntity[];
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELED";
  reasonForCancellation?: string;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
  paymentMethod: "PENDING" | "CASH" | "TRANSFER";
  accountId?: string | Types.ObjectId;
  lang: TLanguage;
  delivery: IDelivery;
  note: string;
  constructor(order: Order, lang: TLanguage) {

  }
}