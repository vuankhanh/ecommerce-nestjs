import { IOrder, IOrderItem } from "./order.interface";

export interface IOrderItemPlain extends Omit<IOrderItem, 'productName'> {
  productName: string;
}

export interface IOrderPlain extends Omit<IOrder, 'orderItems'> {
  orderItems: IOrderItemPlain[];
}
