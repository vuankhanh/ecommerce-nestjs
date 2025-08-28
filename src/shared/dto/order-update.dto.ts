import { IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { TOrderStatus } from "../interface/order.interface";
import { OrderStatus } from "src/constant/order.constant";

export class OrderUpdateStatusDto {
  @IsString({ message: 'Trạng thái đơn hàng phải là một chuỗi' })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: TOrderStatus;

  @ValidateIf(o => o.status === OrderStatus.CANCELED)
  @IsNotEmpty({ message: 'Lý do hủy đơn hàng là bắt buộc khi trạng thái là Đã hủy' })
  reasonForCancelReason?: string;
}