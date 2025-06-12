import { Prop, Schema } from "@nestjs/mongoose";
import { ISupplierProduct } from "src/module/supplier/shared/interface/product.interface";
import { IPurchaseOrderItem } from "src/shared/interface/purchase_order.interface";

@Schema({ timestamps: true })
export class PurchaseOrderItem implements IPurchaseOrderItem {
  @Prop({ type: Object, required: true })
  product: ISupplierProduct;
  
  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true })
  itemTotal: number;

  constructor(order: IPurchaseOrderItem) {
    this.product = order.product;
    this.quantity = order.quantity;
    this.discount = order.discount || 0;
    this.itemTotal = this.calculateItemTotal();
  }

  private calculateItemTotal(): number {
    return this.product.price * this.quantity - this.discount;
  }
}