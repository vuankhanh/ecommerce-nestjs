import { OrderStatus } from "src/constant/order.constant";
import { TPaymentMethod } from "./payment.interface";
import { IDelivery } from "./delivery.interface";

export type TOrderStatus = `${OrderStatus}`;

export interface IOrder {
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  note: string;
  discount: number;
  deliveryFee: number;
  delivery: IDelivery;
}

export interface IOrderItem {
  productThumbnail: string;
  productCode: string;
  productName: string;
  productCategorySlug: string;
  productSlug: string;
  quantity: number;
  price: number;
}