import { IsNotEmpty, IsString } from "class-validator";
import { IDistrict, IProvince, IWard } from "../interface/vn-public-apis.interface";
import { IAddress } from "../interface/address.interface";


export class AddressDto implements IAddress {
  @IsNotEmpty({ message: 'The province is required' })
  province: IProvince; // Province object

  @IsNotEmpty({ message: 'The district is required' })
  district: IDistrict; // District object

  @IsNotEmpty({ message: 'The ward is required' })
  ward: IWard; // Ward name

  @IsNotEmpty({ message: 'The street is required' })
  @IsString({ message: 'The street must be a string' })
  street: string; // Street address
}