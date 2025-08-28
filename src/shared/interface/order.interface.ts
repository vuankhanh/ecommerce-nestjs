import { OrderFrom, OrderStatus } from "src/constant/order.constant";
import { TPaymentMethod } from "./payment.interface";
import { IDelivery } from "./delivery.interface";
import { Types } from "mongoose";
import { TLanguage } from "./lang.interface";

export type TOrderStatus = `${OrderStatus}`;
export type TOrderFrom = `${OrderFrom}`

export interface IOrder {
  orderItems: IOrderItem[];
  status: TOrderStatus;
  paymentMethod: TPaymentMethod;
  note: string;
  discount: number;
  deliveryFee: number;
  delivery: IDelivery;
  lang: TLanguage;
}

export interface IOrderItem {
  productId: string | Types.ObjectId;
  productThumbnail: string;
  productCode: string;
  productName: { [key in TLanguage]: string };
  productCategorySlug: string;
  productSlug: string;
  quantity: number;
  price: number;
}