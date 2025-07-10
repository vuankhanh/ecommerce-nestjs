import { Type } from "class-transformer";
import { IsNotEmpty, IsString, Validate, ValidateNested } from "class-validator";
import { IsVietnamesePhoneNumber } from "src/shared/custom-validator/vietnamese-phone-number.validator";
import { AddressDto } from "src/shared/dto/address.dto";
import { IAddress } from "src/shared/interface/address.interface";
import { IDelivery } from "src/shared/interface/delivery.interface";

export class DeliveryInfoDto implements IDelivery {
  @IsNotEmpty({message: 'Tên là bắt buộc' })
  @IsString({message: 'Tên phải là một chuỗi'})
  name: string;

  @IsNotEmpty({message: 'Số điện thoại là bắt buộc'})
  @IsString({message: 'Số điện thoại phải là một chuỗi'})
  @IsVietnamesePhoneNumber({message: 'Số điện thoại không đúng định dạng Việt Nam'})
  phoneNumber: string;

  @IsNotEmpty({message: 'Địa chỉ là bắt buộc'})
  @ValidateNested()
  @Type(() => AddressDto)
  address: IAddress;
}