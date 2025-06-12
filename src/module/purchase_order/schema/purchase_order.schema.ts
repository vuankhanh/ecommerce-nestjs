import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { PurchaseOrderItem } from "./purchase_order_item.schema";
import { PurchaseOrderStatus } from "src/constant/status.constant";

export type PurchaseOrderDocument = HydratedDocument<Purchase_Order>;

@Schema({ timestamps: true })
export class Purchase_Order {
  @Prop({ type: String, required: true, unique: true, immutable: true })
  readonly orderCode: string;

  @Prop({ type: String, required: true, enum: PurchaseOrderStatus })
  status: `${PurchaseOrderStatus}`;

  @Prop({ type: Array<PurchaseOrderItem>, required: true })
  purchaseOrderItems: PurchaseOrderItem[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  constructor(status: `${PurchaseOrderStatus}`, purchaseOrderItems: PurchaseOrderItem[]) {
    this.orderCode = this.generateOrderCode();
    this.status = status;
    this.purchaseOrderItems = purchaseOrderItems;
    this.totalPrice = this.calculateTotalPrice();
  }

  private generateOrderCode(): string {
    const prefix = 'PORD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0]; // Lấy một phần của UUID để làm số ngẫu nhiên
    return `${prefix}${date}${randomNumber}`;
  }

  private calculateTotalPrice(): number {
    return this.purchaseOrderItems.reduce((total, item) => total + item.itemTotal, 0);
  }
}

export const purchaseOrderSchema = SchemaFactory.createForClass(Purchase_Order);