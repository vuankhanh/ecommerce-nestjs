import { IDelivery } from "./delivery.interface";
import { TOrderStatus } from "./order.interface";
import { TPaymentMethod } from "./payment.interface";

export interface IOrderCreateRequest {
  orderItems: IOrderItemsRequest[];
  paymentMethod: `${TPaymentMethod}`;
  deliveryFee: number;
  discount: number;
  note?: string;
  delivery: IDelivery;
}

export interface IOrderItemsRequest {
  productId: string;
  quantity: number;
}