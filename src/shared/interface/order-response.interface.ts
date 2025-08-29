import { Order } from "src/module/order-basic/schema/order.schema";
import { TOrderFrom } from "./order.interface";

export interface IOrderPopulated extends Omit<Order, 'orderItems' | 'note' | 'accountId' | 'customerDetail'> {
  orderFrom: TOrderFrom;
  productName: string;
  productThumbnail: string;
  productQuantity: number;
  subTotal: number;
}

export interface IOrderDetailPopulated extends Omit<Order, 'accountId' | 'customerDetail'> {
  orderFrom: TOrderFrom;
  customerEmail: string;
}