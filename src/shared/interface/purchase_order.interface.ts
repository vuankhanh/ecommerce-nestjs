import { ISupplierProduct } from "src/module/supplier/shared/interface/product.interface";

export interface IPurchaseOrderItem {
  product: ISupplierProduct;
  quantity: number;
  discount: number;
}