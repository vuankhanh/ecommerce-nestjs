import { IOrderItem } from '../interface/order.interface';
import { OrderItemEntity } from 'src/module/order-basic/entity/order-item.entity';

export class OrderUtil {
  static calculateSubTotal(orderItems: OrderItemEntity[]): number {
    return orderItems.reduce((acc, cur) => acc + cur.total, 0);
  }
  static calculateTotal(
    subTotal: number,
    deliveryFee: number,
    discount: number,
  ): number {
    let total = subTotal;
    total += deliveryFee;
    total -= discount;

    return total;
  }

  static transformOrderItems(orderItems: IOrderItem[]): OrderItemEntity[] {
    return orderItems.map((item) => new OrderItemEntity(item));
  }
}
