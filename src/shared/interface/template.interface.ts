import { Order } from "src/module/order-basic/schema/order.schema";
import { ICustomer } from "./customer.interface";
import { IOrder } from "./order.interface";

export interface ITemplate {
  order: Order;
  footer: IFooterTemplate;
}

export interface IFooterTemplate {
  brandName: string;
  address: string;
  phoneNumber: string;
  email: string;
  fanpage: string;
  website: string;
}

export class Template implements ITemplate {
  order: Order;
  footer: IFooterTemplate;

  constructor(order: Order, footer: IFooterTemplate) {
    this.order = order;
    this.footer = footer;
  }
}