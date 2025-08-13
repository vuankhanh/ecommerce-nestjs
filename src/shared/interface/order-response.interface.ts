import { Order } from "src/module/order-basic/schema/order.schema";
import { IDelivery } from "./delivery.interface";
import { TOrderFrom, TOrderStatus } from "./order.interface";
import { TPaymentMethod } from "./payment.interface";
import { OrderProductItemEntity } from "src/module/order-basic/entity/order-product-item.entity";
import { Types } from "mongoose";
import { AccountDocument } from "src/module/auth/schemas/account.schema";

export class IOrderPopulated extends Order {
  orderCode: string;
  orderItems:  Array<OrderProductItemEntity>;
  status: TOrderStatus;
  reasonForCancellation?: string
  subTotal: number;
  total: number 
  discount: number;
  deliveryFee: number
  paymentMethod: TPaymentMethod;
  accountId?: Types.ObjectId | string;
  customerDetail?: AccountDocument
  delivery: IDelivery;
  note: string;
  orderFrom: TOrderFrom;
}