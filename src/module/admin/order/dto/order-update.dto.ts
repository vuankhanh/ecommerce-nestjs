import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { OrderStatus } from "src/constant/order.constant";
import { PaymentMethod } from "src/constant/payment.constant";
import { DeliveryInfoDto } from "src/shared/dto/delivery.dto";
import { IOrderItemsRequest, IOrderUpdateRequest } from "src/shared/interface/order-request.interface";
import { TOrderStatus } from "src/shared/interface/order.interface";
import { TPaymentMethod } from "src/shared/interface/payment.interface";

export class OrderUpdateStatusDto {
  @IsString({ message: 'Trạng thái đơn hàng phải là một chuỗi' })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: TOrderStatus;

  @ValidateIf(o => o.status === OrderStatus.CANCELED)
  @IsNotEmpty({ message: 'Lý do hủy đơn hàng là bắt buộc khi trạng thái là Đã hủy' })
  reasonForCancallation?: string;
}

export class OrderUpdateDto implements IOrderUpdateRequest {
  @IsOptional()
  @IsArray({ message: 'Danh sách sản phẩm trong đơn hàng phải là một mảng' })
  orderItems: IOrderItemsRequest[];

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