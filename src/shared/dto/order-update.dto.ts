import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { TOrderStatus } from "../interface/order.interface";
import { OrderStatus } from "src/constant/order.constant";
import { IOrderItemsRequest, IOrderUpdateRequest } from "../interface/order-request.interface";
import { PaymentMethod } from "src/constant/payment.constant";
import { TPaymentMethod } from "../interface/payment.interface";
import { Type } from "class-transformer";
import { DeliveryInfoDto } from "./delivery.dto";
import { IsValid } from "../custom-validator/custom-validator";
import { validateOrderItems } from "../custom-validator/order.validator";

export class OrderUpdateDto implements IOrderUpdateRequest {
  @IsOptional()
  @IsValid(validateOrderItems, { message: 'Danh sách sản phẩm trong đơn hàng không đúng' })
  orderItems?: IOrderItemsRequest[];

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod?: TPaymentMethod;

  @IsOptional()
  @IsNumber({}, { message: 'Phí giao hàng phải là một số hợp lệ' })
  deliveryFee?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giảm giá phải là một số hợp lệ' })
  discount?: number;

  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  delivery: DeliveryInfoDto;
}
export class OrderUpdateStatusDto {
  @IsString({ message: 'Trạng thái đơn hàng phải là một chuỗi' })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: TOrderStatus;

  @ValidateIf(o => o.status === OrderStatus.CANCELED)
  @IsNotEmpty({ message: 'Lý do hủy đơn hàng là bắt buộc khi trạng thái là Đã hủy' })
  reasonForCancelReason?: string;
}