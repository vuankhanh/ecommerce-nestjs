import { OrderItem } from "src/module/order-basic/schema/order_product_item.schema";
import { IOrderItem } from "../interface/order.interface";
import { OrderProductItemEntity } from "src/module/order-basic/entity/order-product-item.entity";

export class OrderUtil {
  static calculateSubTotal(orderItems: OrderProductItemEntity[]): number {
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

  static transformOrderItems(orderItems: IOrderItem[]): OrderProductItemEntity[] {
    return orderItems.map(item => new OrderProductItemEntity(item));
  }
}