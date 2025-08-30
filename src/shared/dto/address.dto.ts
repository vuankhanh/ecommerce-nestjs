import { IsNotEmpty, IsString } from 'class-validator';
// import { IDistrict, IProvince, IWard } from "../interface/vn-public-apis.interface";
import {
  IDistrict,
  IProvince,
  IWard,
} from '../interface/tinhthanhpho_com_api.interface';
import { IAddress } from '../interface/address.interface';
import { IsValid } from '../custom-validator/custom-validator';
import {
  validateAddressDistrict,
  validateAddressProvince,
  validateAddressWard,
} from '../custom-validator/address.validator';

export class AddressDto implements IAddress {
  @IsNotEmpty({ message: 'Tỉnh không được để trống' })
  @IsValid(validateAddressProvince, { message: 'Tỉnh không đúng định dạng' })
  province: IProvince; // Province object

  @IsNotEmpty({ message: 'Huyện không được để trống' })
  @IsValid(validateAddressDistrict, { message: 'Huyện không đúng định dạng' })
  district: IDistrict; // District object

  @IsNotEmpty({ message: 'Xã không được để trống' })
  @IsValid(validateAddressWard, { message: 'Xã không đúng định dạng' })
  ward: IWard; // Ward name

  @IsNotEmpty({ message: 'Đường phố không được để trống' })
  @IsString({ message: 'Đường phố phải là chuỗi' })
  street: string; // Street address
}
