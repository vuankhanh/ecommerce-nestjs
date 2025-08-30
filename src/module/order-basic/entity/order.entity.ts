import { IOrder, TOrderStatus } from 'src/shared/interface/order.interface';
import { OrderItemEntity } from './order-item.entity';
import { TPaymentMethod } from 'src/shared/interface/payment.interface';
import { Types } from 'mongoose';
import { IDelivery } from 'src/shared/interface/delivery.interface';
import { v4 as uuidv4 } from 'uuid';
import { OrderUtil } from 'src/shared/util/order.util';
import { TLanguage } from 'src/shared/interface/lang.interface';

export class OrderEntity implements IOrder {
  orderCode: string;
  orderItems: Array<OrderItemEntity>;
  status: TOrderStatus;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
  paymentMethod: TPaymentMethod;
  accountId?: Types.ObjectId;
  lang: TLanguage;
  delivery: IDelivery;
  note: string;

  constructor(order: IOrder) {
    this.orderCode = this.generateOrderCode();
    this.orderItems = OrderUtil.transformOrderItems(order.orderItems);
    this.status = order.status;
    this.subTotal = OrderUtil.calculateSubTotal(this.orderItems);
    this.total = OrderUtil.calculateTotal(
      this.subTotal,
      order.deliveryFee,
      order.discount,
    );
    this.discount = order.discount;
    this.deliveryFee = order.deliveryFee;
    this.paymentMethod = order.paymentMethod;
    this.lang = order.lang;
    this.delivery = order.delivery;
    this.note = order.note;
  }

  private generateOrderCode(): string {
    const prefix = 'ORD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0]; // Lấy một phần của UUID để làm số ngẫu nhiên
    return `${prefix}${date}${randomNumber}`;
  }

  set updateAccountId(accountId: Types.ObjectId) {
    this.accountId = accountId;
  }
}
