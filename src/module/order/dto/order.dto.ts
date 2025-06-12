
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IOrder, IOrderItem, TOrderStatus } from "../../../shared/interface/order.interface";
import { TPaymentMethod } from "../../../shared/interface/payment.interface";
import { PaymentMethod } from "src/constant/payment.constant";
import { OrderStatus } from "src/constant/status.constant";
import { IsValid } from "../../../shared/custom-validator/custom-validator";
import { PartialType } from "@nestjs/mapped-types";
import { OrderItem } from "../schema/order_product_item.schema";

const validateOrderItems = (orderItems: IOrderItem[]) => {
  return Array.isArray(orderItems) && orderItems.length > 0 && orderItems.every(item =>
    typeof item.productCode === 'string' &&
    typeof item.productName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.unit === 'string' &&
    typeof item.price === 'number'
  );
};

export class OrderDto implements IOrder {  
  @IsNotEmpty({ message: 'The orderItems is required' })
  @IsValid(validateOrderItems, { message: 'Order items are not valid' })
  orderItems: OrderItem[];

  @IsNotEmpty({ message: 'The status is required' })
  @IsEnum(OrderStatus, { message: 'The status is not valid' })
  status: TOrderStatus;

  @IsNotEmpty({ message: 'The paymentMethod is required' })
  @IsEnum(PaymentMethod, { message: 'The paymentMethod is not valid' })
  paymentMethod: TPaymentMethod;

  @IsNotEmpty({ message: 'The deliveryFee is required' })
  @IsNumber({}, { message: 'The total must be a number' })
  deliveryFee: number;

  @IsNotEmpty({ message: 'The discount is required' })
  @IsNumber({}, { message: 'The discount must be a number' })
  discount: number;

  @IsString({ message: 'The note must be a string' })
  note: string;

  @IsOptional()
  @IsMongoId({ message: 'The customerId must be a valid ObjectId' })
  customerId?: string;

  @IsOptional()
  @IsString({ message: 'The customer name must be a string' })
  customerName?: string;
  
  @IsOptional()
  @IsString({ message: 'The customerName must be a string' })
  customerPhoneNumber: string;

  @IsOptional()
  @IsString({ message: 'The customer address must be a string' })
  customerAddress?: string;

  @IsOptional()
  @IsString({ message: 'The deliveryAddress must be a string' })
  customerDeliveryAddress?: string;
}

export class UpdateOrderDto extends PartialType(OrderDto) {}