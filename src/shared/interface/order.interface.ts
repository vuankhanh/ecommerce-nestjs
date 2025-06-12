import { OrderStatus } from "src/constant/status.constant";
import { TPaymentMethod } from "./payment.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrder {
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  note: string;
  discount: number;
  deliveryFee: number;
}

export interface IOrderItem {
  productThumbnail: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
}