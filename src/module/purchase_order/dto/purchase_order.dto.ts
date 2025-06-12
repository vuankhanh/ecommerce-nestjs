import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsNotEmpty } from "class-validator";
import { SupplierProductUnit } from "src/constant/product.constant";
import { PurchaseOrderStatus } from "src/constant/status.constant";
import { ISupplierProduct } from "src/module/supplier/shared/interface/product.interface";
import { IsValid } from "src/shared/custom-validator/custom-validator";
import { IPurchaseOrderItem } from "src/shared/interface/purchase_order.interface";

const validateProduct = (product: ISupplierProduct) => {
  return typeof product === 'object' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    Object.values(SupplierProductUnit).includes(product.unit as SupplierProductUnit) && // Kiểm tra unit có nằm trong enum
    (
      product.description === undefined ||
      product.description === null ||
      typeof product.description === 'string'
    ) &&
    typeof product.supplierLocationId === 'string'
}

const validatePurchaseOrderItems = (purchaseOrderItems: IPurchaseOrderItem[]) => {
  return Array.isArray(purchaseOrderItems) && purchaseOrderItems.length > 0 && purchaseOrderItems.every(item => {
    return validateProduct(item.product) &&
      typeof item.quantity === 'number' &&
      (item.discount === undefined || item.discount === null || typeof item.discount === 'number')
  });
};

export class PurchaseOrderDto {
  @IsNotEmpty({ message: 'The purchaseOrderItems is required' })
  @IsValid(validatePurchaseOrderItems, { message: 'Purchase order items are not valid' })
  purchaseOrderItems: IPurchaseOrderItem[];

  @IsEnum(PurchaseOrderStatus, { message: 'The status is not valid' })
  status: PurchaseOrderStatus
}

export class UpdatePurchaseOrderDto extends PartialType(PurchaseOrderDto) {}