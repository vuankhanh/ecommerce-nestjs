import { IOrderItem } from "../interface/order.interface";
import { OrderItem } from "../schema/order_product_item.schema";

export class OrderUtil {
  static calculateSubTotal(orderItems: OrderItem[]): number {
    return orderItems.reduce((acc, cur) => acc + cur.total, 0);
  }
  static calculateTotal(
    subTotal: number,
    deliveryFee: number,
    discount: number
  ): number {
    const amoutAfterDiscount = subTotal * discount / 100;
    let total = subTotal;
    total += deliveryFee;
    total -= amoutAfterDiscount;

    return total;
  }

  static transformOrderItems(orderItems: IOrderItem[]): OrderItem[] {
    return orderItems.map(item => new OrderItem(item));
  }
}