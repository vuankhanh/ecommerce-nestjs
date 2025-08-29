import { Order } from "src/module/order-basic/schema/order.schema";
import { TOrderFrom } from "./order.interface";

export interface IOrderPopulated extends Omit<Order, 'orderItems' | 'delivery' | 'note' | 'accountId' | 'customerDetail'> {
  orderFrom: TOrderFrom;
  subTotal: number;
}

export interface IOrderDetailPopulated extends Omit<Order, 'accountId' | 'customerDetail'> {
  orderFrom: TOrderFrom;
  customerEmail: string;
  customerName: string;
}