import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TPaymentMethod } from '../../../shared/interface/payment.interface';
import { PaymentMethod } from 'src/constant/payment.constant';
import { IsValid } from '../../../shared/custom-validator/custom-validator';
import { DeliveryInfoDto } from 'src/shared/dto/delivery.dto';
import { Type } from 'class-transformer';
import {
  IOrderCreateRequest,
  IOrderItemsRequest,
} from 'src/shared/interface/order-request.interface';
import { validateOrderItems } from 'src/shared/custom-validator/order.validator';

export class OrderCreateDto implements IOrderCreateRequest {
  @IsNotEmpty({ message: 'Danh sách sản phẩm trong đơn hàng là bắt buộc' })
  @IsValid(validateOrderItems, {
    message: 'Danh sách sản phẩm trong đơn hàng không đúng',
  })
  orderItems: IOrderItemsRequest[];

  @IsNotEmpty({ message: 'The paymentMethod is required' })
  @IsEnum(PaymentMethod, { message: 'The paymentMethod is not valid' })
  paymentMethod: TPaymentMethod;

  @IsNotEmpty({ message: 'The deliveryFee is required' })
  @IsNumber({}, { message: 'The total must be a number' })
  deliveryFee: number;

  @IsNotEmpty({ message: 'The discount is required' })
  @IsNumber({}, { message: 'The discount must be a number' })
  discount: number;

  @IsString({ message: 'Thông tin lưu ý phải là chuỗi' })
  note: string;

  @IsNotEmpty({ message: 'Thông tin giao hàng là bắt buộc' })
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  delivery: DeliveryInfoDto;
}
