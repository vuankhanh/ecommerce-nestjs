import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OrderStatus } from "src/constant/status.constant";
import { Customer } from "src/module/customer/schema/customer.schema";
import { IOrder, IOrderItem, TOrderStatus } from "src/shared/interface/order.interface";
import { TPaymentMethod } from "src/shared/interface/payment.interface";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from "./order_product_item.schema";
import { PaymentMethod } from "src/constant/payment.constant";
import { OrderUtil } from "src/shared/util/order.util";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order implements IOrder {
  @Prop({ type: String, required: true, unique: true, immutable: true })
  orderCode: string;

  @Prop({ type: Array<OrderItem>, required: true })
  orderItems: Array<OrderItem>;

  @Prop({ type: String, required: true, default: OrderStatus.PENDING })
  status: TOrderStatus;

  @Prop({ type: Number, required: true })
  subTotal: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: Number, required: true })
  discount: number;

  @Prop({ type: Number, required: true })
  deliveryFee: number;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: TPaymentMethod;

  @Prop({ type: String })
  customerName?: string;

  @Prop({ type: String })
  customerPhoneNumber?: string;

  @Prop({ type: String })
  customerAddress?: string;

  @Prop({ type: String })
  customerDeliveryAddress?: string;

  @Prop({ type: Types.ObjectId, ref: Customer.name })
  customerId?: Types.ObjectId | string;

  @Prop({ type: String })
  note: string;

  constructor(order: IOrder) {
    this.orderCode = this.generateOrderCode();
    this.orderItems = OrderUtil.transformOrderItems(order.orderItems);
    this.status = order.status;
    this.subTotal = OrderUtil.calculateSubTotal(this.orderItems);
    this.total = OrderUtil.calculateTotal(this.subTotal, order.deliveryFee, order.discount);
    this.discount = order.discount;
    this.deliveryFee = order.deliveryFee;
    this.paymentMethod = order.paymentMethod;
    this.note = order.note;
  }

  private generateOrderCode(): string {
    const prefix = 'ORD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0]; // Lấy một phần của UUID để làm số ngẫu nhiên
    return `${prefix}${date}${randomNumber}`;
  }

  set updateCustomerId(customerId: string) {
    this.customerId = ObjectId.createFromHexString(customerId);
  }

  set updateCustomerInfo(customer: Partial<Customer>) {
    this.customerName = customer.name;
    this.customerPhoneNumber = customer.phoneNumber;
    this.customerAddress = customer.address;
  }

  set updateCustomerDeliveryAddress(deliveryAddress: string) {
    this.customerDeliveryAddress = deliveryAddress;
  }

}

export const orderSchema = SchemaFactory.createForClass(Order);